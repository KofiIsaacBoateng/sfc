import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import UnauthorizedError from "../errors/unauthorized.js";
import InternalServerError from "../errors/internal-server.js";
import { sendSuccess } from "../utils/response-formatter.js";
import { normalizeGhanaianPhoneNumber } from "../utils/phone-formatter.js";
import BadRequestError from "../errors/bad-request.js";
import { ConflictError } from "../errors/conflict.js";
import { StatusCodes } from "http-status-codes";

export async function syncUserSession(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser || !firebaseUser.phone_number) {
      throw new UnauthorizedError("Unauthorized: token payload missing");
      return;
    }

    const messyPhone = firebaseUser.phone_number;
    const safePhone = normalizeGhanaianPhoneNumber(messyPhone);
    // Atomically fetch the user or create a completely fresh profile with an empty wallet
    let user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: firebaseUser.uid,
          phoneNumber: safePhone,
        },
      });
    }

    sendSuccess(
      res,
      {
        id: user.id,
        phoneNumber: user.phoneNumber,
        status: user.status,
      },
      "Account authentication synchronization complete",
      200,
    );
  } catch (error) {
    console.error(
      "❌ Database processing error during session synchronization:",
      error,
    );
    throw new InternalServerError(
      "Internal processing failure during session sync",
    );
  }
}

export const linkSFCDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const firebaseUser = req.user;
  const { sfcToken, chipType, role } = req.body;

  if (!firebaseUser)
    throw new UnauthorizedError("You have to sign in to continue!");

  if (!sfcToken || typeof sfcToken !== "string")
    throw new BadRequestError("Hardware token string parameter is missing!");

  // find our user
  const user = await prisma.user.findUnique({
    where: { firebaseUid: firebaseUser.uid },
  });
  if (!user)
    throw new BadRequestError("User profile is missing! Please sign in first!");

  // Ensure device isn't already in use
  const deviceInUse = await prisma.sfcDevice.findFirst({
    where: { id: sfcToken },
  });

  if (deviceInUse) {
    if (deviceInUse.userId === user.id) {
      sendSuccess(
        res,
        { success: "ok" },
        "This SFC device is already liked to your account!",
        StatusCodes.OK,
      );
      return;
    }

    throw new ConflictError("SFC device is already in use by another account!");
  }

  // ATOMIC TRANSACTION MAPPING: Executes both steps or fails completely
  await prisma.$transaction(async (tx) => {
    // Deactivate any currently active sfc device under the name of this account.
    await tx.sfcDevice.updateMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },

      data: {
        status: "DEACTIVATED",
      },
    });

    // If the partial index constraint is broken, PostgreSQL stops the query here
    await tx.sfcDevice.create({
      data: {
        userId: user.id,
        hardwareToken: sfcToken,
        chipType,
        status: "ACTIVE",
      },
    });

    // If the user was stuck in PENDING_ONBOARDING, we upgrate their status to ACTIVE
    if (user.status === "PENDING_ONBOARDING") {
      const data: any = { status: "ACTIVE" };
      if (role) {
        data.role = role;
      }
      await tx.user.update({
        where: { id: user.id },
        data,
      });
    }
  });

  sendSuccess(
    res,
    { success: "ok" },
    "SFC device liked to your account successfully!",
    StatusCodes.CREATED,
  );
};
