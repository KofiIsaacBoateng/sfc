import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";

import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

import { CreatePaymentRequestUseCase } from "../../application/use-cases/create-payment-request.usecase.js";

import type { PaymentRequestReferenceGenerator } from "../../application/ports/payment-request-reference-generator.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";

const TEST_PREFIX = "create-request-it-";

const repositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);

class TestPaymentRequestReferenceGenerator implements PaymentRequestReferenceGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;

    return `${TEST_PREFIX}${this.counter}-${crypto.randomUUID()}`;
  }
}

const referenceGenerator = new TestPaymentRequestReferenceGenerator();

const useCase = new CreatePaymentRequestUseCase(unitOfWork, referenceGenerator);

async function createTestUser(suffix: string) {
  return prisma.user.create({
    data: {
      id: `${TEST_PREFIX}user-${suffix}`,
      firebaseUid: `${TEST_PREFIX}firebase-${suffix}`,
      phoneNumber: `+233543${String(
        100000 + Number(suffix.replace(/\D/g, "") || 1),
      )}`,
      role: "INDIVIDUAL",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

describe("CreatePaymentRequestUseCase - integration", () => {
  beforeEach(async () => {
    await prisma.paymentRequest.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
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

  afterAll(async () => {
    await prisma.paymentRequest.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
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

    await prisma.$disconnect();
  });

  it("should create and persist a pending payment request", async () => {
    const user = await createTestUser("1");

    await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: "GHS",
        balanceMinor: 10_000n,
        status: "ACTIVE",
      },
    });

    const expiresAt = new Date(Date.now() + 60_000);

    const result = await useCase.execute(user.id, {
      amount: "5000",
      currency: Currency.GHS,
      expiresAt: expiresAt,
    });

    expect(result.status).toBe("PENDING");

    expect(result.amount).toBe(5_000n);

    expect(result.feeAmount).toBe(0n);

    expect(result.totalAmount).toBe(5_000n);

    expect(result.transactionId).toBeNull();

    const persisted = await prisma.paymentRequest.findUnique({
      where: {
        id: result.id,
      },
    });

    expect(persisted).not.toBeNull();

    expect(persisted?.requesterId).toBe(user.id);

    expect(persisted?.amount).toBe(5_000n);

    expect(persisted?.feeAmount).toBe(0n);

    expect(persisted?.totalAmount).toBe(5_000n);

    expect(persisted?.status).toBe("PENDING");

    expect(persisted?.transactionId).toBeNull();
  });

  it("should not modify the requester's wallet balance", async () => {
    const user = await createTestUser("2");

    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: "GHS",
        balanceMinor: 25_000n,
        status: "ACTIVE",
      },
    });

    await useCase.execute(user.id, {
      amount: "5000",
      currency: Currency.GHS,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const walletAfter = await prisma.wallet.findUnique({
      where: {
        id: wallet.id,
      },
    });

    expect(walletAfter?.balanceMinor).toBe(25_000n);
  });

  it("should reject creation when the requester has no wallet", async () => {
    const user = await createTestUser("3");

    await expect(
      useCase.execute(user.id, {
        amount: "5000",
        currency: Currency.GHS,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow("Requester wallet not found.");

    expect(
      await prisma.paymentRequest.count({
        where: {
          reference: {
            startsWith: TEST_PREFIX,
          },
        },
      }),
    ).toBe(0);
  });

  it("should reject creation for a locked wallet", async () => {
    const user = await createTestUser("4");

    await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: "GHS",
        balanceMinor: 25_000n,
        status: "LOCKED",
      },
    });

    await expect(
      useCase.execute(user.id, {
        amount: "5000",
        currency: Currency.GHS,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow("Requester wallet is not active.");
  });
});
