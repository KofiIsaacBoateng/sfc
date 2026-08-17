import {
  User,
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import type { WalletProvisioningService } from "@/modules/wallets/application/services/wallet-provisioning.service.js";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import { describe, expect, it, vi } from "vitest";
import {
  Wallet,
  WalletStatus,
} from "@/modules/wallets/domain/entities/wallet.entity.js";
import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";
import { UserProvisioningService } from "../application/services/user-provisioning.service.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

describe("UserProvisioningService", () => {
  it("should return existing user if user exists", async () => {
    const existingUser = User.restore({
      id: "user-123",
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.restore("+233541236789"),
      displayName: "Test User",
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2026-07-29T10:00:00.000Z"),
      updatedAt: new Date("2026-07-29T10:00:00.000Z"),
    });

    const unitOfWork = {
      execute: vi.fn(async (work) =>
        work({
          users: {
            findByFirebaseUid: vi.fn().mockResolvedValue(existingUser),
          },
          ledger: {} as never,
          wallets: {} as never,
        }),
      ),
    } as unknown as UnitOfWork;

    const walletProvisioningService: WalletProvisioningService = {
      createDefaultWallet: vi.fn(),
    };

    const service = new UserProvisioningService(
      unitOfWork,
      walletProvisioningService,
    );
    const result = await service.provision({
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.restore("+233541236789"),
      role: UserRole.INDIVIDUAL,
    });

    expect(result).toBe(existingUser);
    expect(
      walletProvisioningService.createDefaultWallet,
    ).not.toHaveBeenCalled();
  });

  it("should create user, wallet, and ledger account when user doesn't exist", async () => {
    const createdUser = User.restore({
      id: "user-123",
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.restore("+233541236789"),
      displayName: "Test User",
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2026-07-29T10:00:00.000Z"),
      updatedAt: new Date("2026-07-29T10:00:00.000Z"),
    });

    const createdWallet = Wallet.restore({
      id: "wallet-123",
      userId: "user-123",
      status: WalletStatus.ACTIVE,
      balanceMinor: 2_500n,
      currency: Currency.GHS,
      updatedAt: new Date("2026-07-29T10:00:00.000Z"),
      createdAt: new Date("2026-07-29T10:00:00.000Z"),
    });

    const repos = {
      ledger: { create: vi.fn().mockResolvedValue({}) },
      wallets: { create: vi.fn().mockResolvedValue(createdWallet) },
      users: {
        create: vi.fn().mockResolvedValue(createdUser),
        findByFirebaseUid: vi.fn().mockResolvedValue(null),
      },
    } as unknown as Repositories;

    const walletProvisioningService = {
      createDefaultWallet: vi.fn().mockResolvedValue(createdWallet),
    } as unknown as WalletProvisioningService;

    const unitOfWork = {
      execute: vi.fn(async (work) => work(repos)),
    };

    const service = new UserProvisioningService(
      unitOfWork,
      walletProvisioningService,
    );
    const result = await service.provision({
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.restore("+233541236789"),
      role: UserRole.INDIVIDUAL,
    });

    expect(repos.users.findByFirebaseUid).toHaveBeenCalledWith(
      "firebase-id-123",
    );
    expect(repos.users.create).toHaveBeenCalledTimes(1);
    expect(walletProvisioningService.createDefaultWallet).toHaveBeenCalledWith(
      { wallets: repos.wallets, ledger: repos.ledger },
      { userId: "user-123" },
    );
    expect(result).toBe(createdUser);
  });

  it("should throw when wallet provisioning fails", async () => {
    const createdUser = User.restore({
      id: "user-789",
      firebaseUid: "firebase-uid-789",
      phoneNumber: PhoneNumber.restore("+233541239999"),
      displayName: "Test User",
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const usersRepo = {
      findByFirebaseUid: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(createdUser),
    };

    const walletsRepo = {
      create: vi.fn(),
    };

    const ledgerRepo = {
      create: vi.fn(),
    };

    const unitOfWork = {
      execute: vi.fn(async (work) =>
        work({
          users: usersRepo,
          wallets: walletsRepo,
          ledger: ledgerRepo,
        }),
      ),
    } as unknown as UnitOfWork;

    const walletProvisioningService = {
      createDefaultWallet: vi
        .fn()
        .mockRejectedValue(new Error("Wallet provisioning failed")),
    } as unknown as WalletProvisioningService;

    const service = new UserProvisioningService(
      unitOfWork,
      walletProvisioningService,
    );

    await expect(
      service.provision({
        firebaseUid: "firebase-uid-789",
        phoneNumber: PhoneNumber.restore("+233541239999"),
        role: UserRole.INDIVIDUAL,
      }),
    ).rejects.toThrow("Wallet provisioning failed");

    expect(usersRepo.create).toHaveBeenCalledTimes(1);
    expect(walletProvisioningService.createDefaultWallet).toHaveBeenCalledTimes(
      1,
    );
  });
});
