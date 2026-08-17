import {
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import { WalletStatus } from "@/modules/wallets/domain/entities/wallet.entity.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

const prismaRepositoryFactory = new PrismaRepositoryFactory();
const prismaUnitOfWork = new PrismaUnitOfWork(prisma, prismaRepositoryFactory);

const TEST_PREFIX = "uow-it";

describe("PrismaUnitOfWork - integration", () => {
  /*** CLEAN TEST DB OF ALL TEST ENTRIES BEFORE RUNNING ANOTHER TEST */
  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany({
      where: {
        transaction: {
          reference: {
            startsWith: TEST_PREFIX,
          },
        },
      },
    });

    await prisma.transaction.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.ledgerAccount.deleteMany({
      where: {
        wallet: {
          user: {
            firebaseUid: {
              startsWith: TEST_PREFIX,
            },
          },
        },
      },
    });

    await prisma.wallet.deleteMany({
      where: {
        user: {
          firebaseUid: {
            startsWith: TEST_PREFIX,
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        firebaseUid: {
          startsWith: TEST_PREFIX,
        },
      },
    });
  });

  /*** DISCONNECT DB AFTER TEST */
  afterAll(async () => {
    prisma.$disconnect();
  });

  /** it should commit changes when work succeeds */
  it("should commit changes when work succeeds", async () => {
    const user = await prisma.user.create({
      data: {
        id: `${TEST_PREFIX}-commit-user`,
        firebaseUid: `${TEST_PREFIX}-commit-firebase-123`,
        displayName: "Test user",
        phoneNumber: "+233543126789",
        role: UserRole.INDIVIDUAL,
        status: UserStatus.ACTIVE,
      },
    });

    const wallet = await prisma.wallet.create({
      data: {
        id: `${TEST_PREFIX}-commit-wallet`,
        userId: user.id,
        currency: Currency.GHS,
        balanceMinor: 10_000n,
        status: WalletStatus.ACTIVE,
      },
    });

    await prismaUnitOfWork.execute(async (repos) => {
      await repos.wallets.debit(wallet.id, 7_000n);
    });

    const persistedWallet = await prisma.wallet.findUnique({
      where: {
        id: wallet.id,
      },
    });

    expect(persistedWallet?.balanceMinor).toBe(3_000n);
  });

  /** it should rollback all changes when work fails */
  it("should rollback changes when work fails", async () => {
    const user = await prisma.user.create({
      data: {
        id: `${TEST_PREFIX}-rollback-user`,
        firebaseUid: `${TEST_PREFIX}-rollback-firebase-123`,
        displayName: "Test user",
        phoneNumber: "+233543126789",
        role: UserRole.INDIVIDUAL,
        status: UserStatus.ACTIVE,
      },
    });

    const wallet = await prisma.wallet.create({
      data: {
        id: `${TEST_PREFIX}-commit-wallet`,
        userId: user.id,
        currency: Currency.GHS,
        balanceMinor: 10_000n,
        status: WalletStatus.ACTIVE,
      },
    });

    await expect(
      prismaUnitOfWork.execute(async (repos) => {
        await repos.wallets.credit(wallet.id, 5_000n);

        throw new Error("Simulated transaction failure!");
      }),
    ).rejects.toThrow("Simulated transaction failure!");

    const persistedWallet = await prisma.wallet.findUnique({
      where: {
        id: wallet.id,
      },
    });

    expect(persistedWallet?.balanceMinor).toBe(10_000n);
  });

  /** it should rollback multiple repository changes together when work fails */
  it("should rollback multiple repository changes together when work fails", async () => {
    const sender = await prisma.user.create({
      data: {
        id: `${TEST_PREFIX}-rollback-sender`,
        firebaseUid: `${TEST_PREFIX}-sender-firebase-123`,
        displayName: "Test user",
        phoneNumber: "+233543126789",
        role: UserRole.INDIVIDUAL,
        status: UserStatus.ACTIVE,
      },
    });

    const recipient = await prisma.user.create({
      data: {
        id: `${TEST_PREFIX}-rollback-recipient`,
        firebaseUid: `${TEST_PREFIX}-recipient-firebase-123`,
        displayName: "Test user",
        phoneNumber: "+233543987621",
        role: UserRole.INDIVIDUAL,
        status: UserStatus.ACTIVE,
      },
    });

    const senderWalletBefore = await prisma.wallet.create({
      data: {
        id: `${TEST_PREFIX}-sender-wallet`,
        userId: sender.id,
        currency: Currency.GHS,
        balanceMinor: 10_000n,
        status: WalletStatus.ACTIVE,
      },
    });

    const recipientWalletBefore = await prisma.wallet.create({
      data: {
        id: `${TEST_PREFIX}-recipient-wallet`,
        userId: recipient.id,
        currency: Currency.GHS,
        balanceMinor: 2_000n,
        status: WalletStatus.ACTIVE,
      },
    });

    await expect(
      prismaUnitOfWork.execute(async (repos) => {
        await repos.wallets.debit(senderWalletBefore.id, 5_000n);

        await repos.wallets.credit(recipientWalletBefore.id, 5_000n);

        throw new Error("Simulated transaction failure!");
      }),
    ).rejects.toThrow("Simulated transaction failure!");

    const senderWalletAfter = await prisma.wallet.findUnique({
      where: {
        id: senderWalletBefore.id,
      },
    });

    const recipientWalletAfer = await prisma.wallet.findUnique({
      where: {
        id: recipientWalletBefore.id,
      },
    });

    expect(senderWalletAfter?.balanceMinor).toBe(10_000n);
    expect(recipientWalletAfer?.balanceMinor).toBe(2_000n);
  });
});
