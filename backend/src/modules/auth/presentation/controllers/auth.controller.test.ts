import type { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "./auth.controller.js";
import type { Request, Response } from "express";
import BadRequestError from "@/shared/errors/bad-request.js";
import {
  User,
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";

vi.mock("@/shared/utils/response-formatter.js", () => ({
  sendSuccess: vi.fn(),
}));
describe("Auth controller", () => {
  let loginUseCase: LoginUseCase;
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    loginUseCase = {
      execute: vi.fn(),
    } as unknown as LoginUseCase;

    authController = new AuthController(loginUseCase);
  });

  it("should throw BadRequestError for invalid payload", async () => {
    req.body = {
      firebaseToken: "",
    };

    await expect(
      authController.login(req as Request, res as Response),
    ).rejects.toThrow(BadRequestError);

    await expect(
      authController.login(req as Request, res as Response),
    ).rejects.toThrow("Invalid login payload");

    expect(loginUseCase.execute).not.toHaveBeenCalled();
  });

  it("should pass validated data to loginUsecase and return successful response formatting", async () => {
    req.body = {
      firebaseToken: "firebase-token-123",
      role: UserRole.INDIVIDUAL,
    };

    const user = User.restore({
      id: "user-123",
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.restore("+233541236789"),
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2026-07-01T10:00:00.000Z"),
      updatedAt: new Date("2026-07-01T10:00:00.000Z"),
    });

    vi.mocked(loginUseCase.execute).mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user,
    });

    await authController.login(req as Request, res as Response);

    // assertions
    expect(loginUseCase.execute).toHaveBeenCalledWith(req.body);

    expect(sendSuccess).toHaveBeenCalledTimes(1);
    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      expect.objectContaining({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          ...user,
          phoneNumber: user.phoneNumber.value,
        },
      }),
    );
  });
});
