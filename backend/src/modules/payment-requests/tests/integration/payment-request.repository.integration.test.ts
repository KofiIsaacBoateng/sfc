import type {
  PaymentRequest,
  User as PrismaUser,
} from "@/generated/client/client.js";
import {
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { randomUUID } from "crypto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PaymentRequestStatus } from "../../domain/entities/payment-request.entity.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import { PrismaPaymentRequestRepository } from "../../infrastructure/prisma/prisma-payment-request.repository.js";

const TEST_PREFIX = "payment-request-repo-it";

const repos = new PrismaPaymentRequestRepository(prisma);

async function createTestUser(suffix: string): Promise<PrismaUser> {
  return prisma.user.create({
    data: {
      id: `${TEST_PREFIX}-USER-${suffix}`,
      firebaseUid: `${TEST_PREFIX}-FIREBASEUID-${suffix}`,
      phoneNumber: `+233541${String(100000 + Number(suffix.replace(/\D/g, "") || 1))}`,
      displayName: "TEST USER",
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
    },
  });
}

async function createPaymentRequestFixture(options?: {
  status?: PaymentRequestStatus;
  expiresAt?: Date;
}): Promise<PaymentRequest> {
  const user = await createTestUser(randomUUID().slice(0, 8));

  return prisma.paymentRequest.create({
    data: {
      requesterId: user.id,
      amount: 10_000n,
      feeAmount: 40n,
      totalAmount: 10_040n,
      currency: Currency.GHS,
      reference: `${TEST_PREFIX}${randomUUID()}`,
      status: options?.status ?? PaymentRequestStatus.PENDING,
      expiresAt: options?.expiresAt ?? new Date(Date.now() + 60_000),
    },
  });
}

describe("PaymentRequestRepository - integration", async () => {
  beforeEach(async () => {
    await prisma.paymentRequest.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
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

    await prisma.user.deleteMany({
      where: {
        firebaseUid: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.$disconnect();
  });

  /** it should claim a pending payment request */
  it("should claim a pending request", async () => {
    const request = await createPaymentRequestFixture();

    const claimedRequest = await repos.claimPending(request.id);

    expect(claimedRequest).not.toBeNull();
    expect(claimedRequest?.status).toBe(PaymentRequestStatus.PROCESSING);

    const persisted = await prisma.paymentRequest.findUnique({
      where: {
        id: request.id,
      },
    });

    expect(persisted?.status).toBe(PaymentRequestStatus.PROCESSING);
  });

  /** it should not claim a non-pending payment request */
  it("should not claim a non-pending payment request", async () => {
    const request = await createPaymentRequestFixture({
      status: PaymentRequestStatus.CANCELLED,
    });

    const claimed = await repos.claimPending(request.id);

    expect(claimed).toBeNull();
  });

  /** it should not claim an expired request */
  it("should not claim an expired request", async () => {
    const request = await createPaymentRequestFixture({
      expiresAt: new Date(Date.now() - 60_000),
    });

    const claimed = await repos.claimPending(request.id);

    expect(claimed).toBeNull();

    const persisted = await prisma.paymentRequest.findUnique({
      where: {
        id: request.id,
      },
    });

    expect(persisted?.status).toBe(PaymentRequestStatus.PENDING);
  });

  /** it should allow only one concurrent claim */
  it("should allow only one concurrent claim", async () => {
    const request = await createPaymentRequestFixture();

    const [first, second] = await Promise.all([
      repos.claimPending(request.id),
      ,
      repos.claimPending(request.id),
    ]);

    const successfulClaims = [first, second].filter(Boolean);

    expect(successfulClaims).toHaveLength(1);

    const persisted = await prisma.paymentRequest.findUnique({
      where: {
        id: request.id,
      },
    });
    expect(persisted?.status).toBe(PaymentRequestStatus.PROCESSING);
  });
});
