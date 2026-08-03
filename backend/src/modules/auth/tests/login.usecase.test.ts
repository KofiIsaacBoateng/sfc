import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  User,
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import type { FirebaseAuthProvider } from "../application/ports/firebase-auth.provider.js";
import type { JwtService } from "../application/ports/jwt.service.js";
import type { UserProvisioningService } from "../application/services/user-provisioning.service.js";
import { LoginUseCase } from "../application/use-cases/login.usecase.js";

describe("Login use case", () => {
  let firebaseAuthProvider: FirebaseAuthProvider;
  let jwtService: JwtService;
  let userProvisioningService: UserProvisioningService;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    firebaseAuthProvider = {
      verifyIdToken: vi.fn(),
    };

    jwtService = {
      issueToken: vi.fn(),
    };

    userProvisioningService = {
      provision: vi.fn(),
    } as unknown as UserProvisioningService;

    loginUseCase = new LoginUseCase(
      firebaseAuthProvider,
      userProvisioningService,
      jwtService,
    );
  });

  it("Should verify firebase tokens, provision user, issue tokens, and return login results", async () => {
    vi.mocked(firebaseAuthProvider.verifyIdToken).mockResolvedValue({
      firebaseIdUid: "firebase-uid-123",
      phoneNumber: "+233541236789",
    });

    const user = User.restore({
      id: "user-123",
      firebaseUid: "firebase-uid-123",
      phoneNumber: PhoneNumber.restore("+233541236789"),
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2026-07-01T10:00:00.000Z"),
      updatedAt: new Date("2026-07-01T10:00:00.000Z"),
    });

    vi.mocked(userProvisioningService.provision).mockResolvedValue(user);

    vi.mocked(jwtService.issueToken).mockReturnValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const result = await loginUseCase.execute({
      firebaseToken: "firebase-id-token",
      role: UserRole.INDIVIDUAL,
    });

    expect(firebaseAuthProvider.verifyIdToken).toHaveBeenCalledWith(
      "firebase-id-token",
    );

    expect(userProvisioningService.provision).toHaveBeenCalledWith({
      firebaseUid: "firebase-uid-123",
      phoneNumber: expect.any(PhoneNumber),
      role: UserRole.INDIVIDUAL,
    });

    expect(jwtService.issueToken).toHaveBeenCalledWith(user);

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user,
    });
  });
});
