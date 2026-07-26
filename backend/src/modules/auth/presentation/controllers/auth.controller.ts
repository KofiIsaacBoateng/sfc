import z from "zod";
import { UserRole } from "../../../users/domain/entities/user.entity.js";
import type { Request, Response } from "express";
import type { LoginUseCase } from "../../application/use-cases/login.usecase.js";
import { BadRequestError } from "@/shared/errors/index.js";
import { sendSuccess } from "@/shared/utils/response-formatter.js";

const loginSchema = z.object({
  firebaseToken: z.string().min(1),
  role: z.enum(UserRole),
});

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new BadRequestError("VALIDATION_ERROR", "Invalid login payload");
    }

    const { accessToken, refreshToken, user } = await this.loginUseCase.execute(
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
