import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

export async function syncUserSession(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser || !firebaseUser.phone_number) {
      res.status(400).json({
        error: "Valid phone number required inside authentication token",
      });
      return;
    }

    // Atomically fetch the user or create a completely fresh profile with an empty wallet
    let user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: firebaseUser.uid,
          phoneNumber: firebaseUser.phone_number,
        },
      });
    }

    res.status(200).json({
      message: "Account authentication synchronization complete",
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(
      "❌ Database processing error during session synchronization:",
      error,
    );
    res
      .status(500)
      .json({ error: "Internal processing failure during session sync" });
  }
}
