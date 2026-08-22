import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";

import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

import { CreateMerchantPaymentUseCase } from "../../application/use-cases/create-merchant-payment.usecase.js";

import { DefaultMerchantChargePolicy } from "../../domain/policies/merchant-charge.policy.js";

import type { PaymentRequestReferenceGenerator } from "@/modules/payment-requests/application/ports/payment-request-reference-generator.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";

const TEST_PREFIX = "merchant-request-it-";

const repositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);

const chargePolicy = new DefaultMerchantChargePolicy();

class TestPaymentRequestReferenceGenerator implements PaymentRequestReferenceGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;

    return `${TEST_PREFIX}${this.counter}-${crypto.randomUUID()}`;
  }
}

const referenceGenerator = new TestPaymentRequestReferenceGenerator();

const useCase = new CreateMerchantPaymentUseCase(
  unitOfWork,
  chargePolicy,
  referenceGenerator,
);

async function createTestUser(suffix: string) {
  return prisma.user.create({
    data: {
      id: `${TEST_PREFIX}user-${suffix}`,
      firebaseUid: `${TEST_PREFIX}firebase-${suffix}`,
      phoneNumber: `+233544${String(
        100000 + Number(suffix.replace(/\D/g, "") || 1),
      )}`,
      role: "INDIVIDUAL",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function createMerchant(userId: string) {
  return prisma.merchant.create({
    data: {
      userId,
      businessName: "Integration Test Merchant",
      status: "ACTIVE",
    },
  });
}

describe("CreateMerchantPaymentUseCase - integration", () => {
  beforeEach(async () => {
    await prisma.paymentRequest.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.merchant.deleteMany({
      where: {
        user: {
          firebaseUid: {
            startsWith: TEST_PREFIX,
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

  afterAll(async () => {
    await prisma.paymentRequest.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.merchant.deleteMany({
      where: {
        user: {
          firebaseUid: {
            startsWith: TEST_PREFIX,
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

    await prisma.$disconnect();
  });

  it("should create a merchant payment request with the correct fee", async () => {
    const merchantUser = await createTestUser("1");

    await createMerchant(merchantUser.id);

    await prisma.wallet.create({
      data: {
        userId: merchantUser.id,
        currency: "GHS",
        balanceMinor: 0n,
        status: "ACTIVE",
      },
    });

    const result = await useCase.execute(merchantUser.id, {
      amount: "10000",
      currency: Currency.GHS,
      expiresAt: new Date(Date.now() + 60_000),
    });

    /*
     * Default policy:
     * 0.4% of 10,000 = 40
     */
    expect(result.amount).toBe(10_000n);

    expect(result.feeAmount).toBe(40n);

    expect(result.totalAmount).toBe(10_040n);

    expect(result.status).toBe("PENDING");

    const persisted = await prisma.paymentRequest.findUnique({
      where: {
        id: result.id,
      },
    });

    expect(persisted).not.toBeNull();

    expect(persisted?.requesterId).toBe(merchantUser.id);

    expect(persisted?.amount).toBe(10_000n);

    expect(persisted?.feeAmount).toBe(40n);

    expect(persisted?.totalAmount).toBe(10_040n);

    expect(persisted?.status).toBe("PENDING");
  });

  it("should not modify the merchant wallet when creating a request", async () => {
    const merchantUser = await createTestUser("2");

    await createMerchant(merchantUser.id);

    const wallet = await prisma.wallet.create({
      data: {
        userId: merchantUser.id,
        currency: "GHS",
        balanceMinor: 1_500n,
        status: "ACTIVE",
      },
    });

    await useCase.execute(merchantUser.id, {
      amount: "10000",
      currency: Currency.GHS,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const walletAfter = await prisma.wallet.findUnique({
      where: {
        id: wallet.id,
      },
    });

    expect(walletAfter?.balanceMinor).toBe(1_500n);
  });

  it("should reject a user who is not a merchant", async () => {
    const user = await createTestUser("3");

    await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: "GHS",
        balanceMinor: 1_500n,
        status: "ACTIVE",
      },
    });

    await expect(
      useCase.execute(user.id, {
        amount: "10000",
        currency: Currency.GHS,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow("Merchant account not found.");
  });

  it("should reject a suspended merchant", async () => {
    const merchantUser = await createTestUser("4");

    await prisma.merchant.create({
      data: {
        userId: merchantUser.id,
        businessName: "Suspended Merchant",
        status: "SUSPENDED",
      },
    });

    await prisma.wallet.create({
      data: {
        userId: merchantUser.id,
        currency: "GHS",
        balanceMinor: 1_500n,
        status: "ACTIVE",
      },
    });

    await expect(
      useCase.execute(merchantUser.id, {
        amount: "10000",
        currency: Currency.GHS,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow("Merchant account is not active.");
  });

  it("should reject a merchant without a wallet", async () => {
    const merchantUser = await createTestUser("5");

    await createMerchant(merchantUser.id);

    await expect(
      useCase.execute(merchantUser.id, {
        amount: "10000",
        currency: Currency.GHS,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow("Merchant wallet not found.");
  });

  it("should reject an inactive merchant wallet", async () => {
    const merchantUser = await createTestUser("6");

    await createMerchant(merchantUser.id);

    await prisma.wallet.create({
      data: {
        userId: merchantUser.id,
        currency: "GHS",
        balanceMinor: 1_500n,
        status: "LOCKED",
      },
    });

    await expect(
      useCase.execute(merchantUser.id, {
        amount: "10000",
        currency: Currency.GHS,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    ).rejects.toThrow("Merchant wallet is not active.");
  });
});
