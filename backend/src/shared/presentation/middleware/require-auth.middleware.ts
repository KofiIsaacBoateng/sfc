import type { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import type {
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import UnauthorizedError from "../../errors/unauthorized.js";
import jwt from "jsonwebtoken";

type AccessTokenPayload = {
  sub: string;
  firebaseUid: admin.auth.DecodedIdToken;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
};

export const requireAuth = (secret: string) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "INVALID_ACCESS_TOKEN",
        "Missing bearer token!",
      );
    }

    const token = header.slice("Bearer ".length);

    try {
      const payload = jwt.verify(token, secret) as AccessTokenPayload;

      req.authUser = {
        userId: payload.sub,
        firebaseUid: payload.firebaseUid,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
        status: payload.status,
      };

      return next();
    } catch (error) {
      throw new UnauthorizedError(
        "INVALID_ACCESS_TOKEN",
        "Invalid or expired token",
      );
    }
  };
};
