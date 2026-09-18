import UnauthorizedError from "@/shared/errors/unauthorized.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { Request, Response } from "express";
import type { GetMyProfileUseCase } from "../../application/use-cases/get-my-profile.usecase.js";
import { toUserResponse } from "../../application/dto/user-response.dto.js";

export class UsersController {
  constructor(private readonly getMyProfileUseCase: GetMyProfileUseCase) {}

  async me(req: Request, res: Response): Promise<void> {
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
  }

  async getMyProfile(req: Request, res: Response): Promise<void> {
    const user = await this.getMyProfileUseCase.execute(req.authUser.userId);

    sendSuccess(res, toUserResponse(user), "Fetched user profile successully!");
  }
}
