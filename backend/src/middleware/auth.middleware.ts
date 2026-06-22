import type { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase.js";
import * as admin from "firebase-admin";

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export const authenticateFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ error: "Authorization token missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Invalid token. May be malformed!" });
    return;
  }

  try {
    const decodedToken = await auth!.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Authentication session has expired or is invalid",
    });
  }
};
