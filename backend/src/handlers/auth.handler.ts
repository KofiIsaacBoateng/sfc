import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import UnauthorizedError from "../errors/unauthorized.js";
import InternalServerError from "../errors/internal-server.js";
import { sendSuccess } from "../utils/response-formatter.js";
import { normalizeGhanaianPhoneNumber } from "../utils/phone-formatter.js";

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
