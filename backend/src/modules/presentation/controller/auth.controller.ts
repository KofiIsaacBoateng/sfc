import z from "zod";
import { UserRole } from "../../users/domain/entities/user.entity.js";
import type { Request, Response, NextFunction } from "express";
import type { LoginUseCase } from "../../auth/application/use-cases/login.usecase.js";
import BadRequestError from "@/src/shared/errors/bad-request.js";
import { sendSuccess } from "@/src/shared/utils/response-formatter.js";

const loginSchema = z.object({
  firebaseUid: z.string().min(1),
  role: z.enum(UserRole),
});

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response, _: NextFunction) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new BadRequestError("VALIDATION_ERROR", "Invalid login payload");
    }

    const { accessToken, refreshToken, user } = await this.loginUseCase.create(
      parsed.data,
    );

    sendSuccess(res, {
      accessToken,
      refreshToken,
      user: {
        ...user,
        phoneNumber: user.phoneNumber.value,
      },
    });
  };
}
