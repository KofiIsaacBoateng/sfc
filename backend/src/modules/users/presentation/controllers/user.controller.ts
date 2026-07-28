import UnauthorizedError from "@/shared/errors/unauthorized.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { Request, Response } from "express";

export class UsersController {
  me = (req: Request, res: Response) => {
    if (!req.authUser) {
      throw new UnauthorizedError(undefined, "Unauthorized user.");
    }

    sendSuccess(res, {
      id: req.authUser.userId,
      firebaseUid: req.authUser.firebaseUid,
      phoneNumber: req.authUser.phoneNumber,
      role: req.authUser.role,
      status: req.authUser.status,
    });
  };
}
