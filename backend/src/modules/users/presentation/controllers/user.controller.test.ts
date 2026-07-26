import { describe, expect, it, vi, beforeEach } from "vitest";
import { UsersController } from "./user.controller.js";
import type { Request, Response } from "express";
import UnauthorizedError from "@/shared/errors/unauthorized.js";
import { sendSuccess } from "@/shared/utils/response-formatter.js";
import { UserRole, UserStatus } from "../../domain/entities/user.entity.js";
import * as admin from "firebase-admin";

// mock response formatter utility
vi.mock("@/shared/utils/response-formatter.js", () => ({
  sendSuccess: vi.fn(),
}));

describe("Users controller", () => {
  let usersController: UsersController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    usersController = new UsersController();
    res = {};
    vi.clearAllMocks();
  });

  it("should throw UnauthorizedError if req.authUser is missing", () => {
    req = {};

    expect(() => {
      usersController.me(req as Request, res as Response);
    }).toThrow(UnauthorizedError);

    expect(() => {
      usersController.me(req as Request, res as Response);
    }).toThrow("Unauthorized user.");

    expect(sendSuccess).not.toHaveBeenCalled();
  });

  it("should return a filtered user data when req.authUser exists", () => {
    const authUser = {
      userId: "user-123",
      firebaseUid: "firebase-id-123" as unknown as admin.auth.DecodedIdToken,
      phoneNumber: "+233541236789",
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
      extraField: "should-be-ignored",
    };

    req = { authUser };

    usersController.me(req as Request, res as Response);

    expect(sendSuccess).toHaveBeenCalledTimes(1);
    expect(sendSuccess).toHaveBeenCalledWith(res, {
      id: "user-123",
      firebaseUid: "firebase-id-123",
      phoneNumber: "+233541236789",
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
    });
  });
});
