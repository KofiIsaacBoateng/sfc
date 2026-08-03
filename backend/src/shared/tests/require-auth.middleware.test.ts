import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAuth } from "../presentation/middleware/require-auth.middleware.js";
import type { Request, Response, NextFunction } from "express";
import {
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import * as admin from "firebase-admin";
import jwt from "jsonwebtoken";

describe("Require auth middleware", () => {
  const secret = "access-secret";
  let middleware: ReturnType<typeof requireAuth>;
  let next: Partial<NextFunction>;
  let res: Partial<Response>;

  beforeEach(() => {
    middleware = requireAuth(secret);
    next = vi.fn();
    res = {};
  });

  it("should throw UnauthorizedError for missing or malformed header structure", () => {
    const reqMissing = { headers: {} };
    const reqInvalidPrefix = {
      headers: { authorization: "invalid-bearer-token" },
    };

    expect(() => {
      middleware(reqMissing as Request, res as Response, next as NextFunction);
    }).toThrow("Missing bearer token!");

    expect(() => {
      middleware(
        reqInvalidPrefix as Request,
        res as Response,
        next as NextFunction,
      );
    }).toThrow("Missing bearer token!");

    expect(next).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if token signature is invalid or expired", () => {
    const reqBadToken = {
      headers: { authorization: "Bearer completely-bogus-token" },
    };

    expect(() => {
      middleware(reqBadToken as Request, res as Response, next as NextFunction);
    }).toThrow("Invalid or expired token");

    expect(next).not.toHaveBeenCalled();
  });

  it("should attach authUser and call next for a valid token", () => {
    const payload = {
      sub: "user-123",
      firebaseUid: "firebase-id-123" as unknown as admin.auth.DecodedIdToken,
      phoneNumber: "+233541236789",
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
    };

    const token = jwt.sign(payload, secret);
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as Request;

    middleware(req, res as Response, next as NextFunction);

    expect(req.authUser).toEqual({
      userId: "user-123",
      firebaseUid: "firebase-id-123",
      phoneNumber: "+233541236789",
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
