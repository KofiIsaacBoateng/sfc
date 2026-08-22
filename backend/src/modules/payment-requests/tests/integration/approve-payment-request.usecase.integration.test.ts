import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { afterAll, describe, expect, it, beforeEach } from "vitest";
import { ApprovePaymentRequestUseCase } from "../../application/use-cases/approve-payment-request.usecase.js";
import { randomUUID } from "crypto";
import {
  type LedgerAccount as PrismaLedgerAccount,
  type User as PrismaUser,
  type Wallet as PrismaWallet,
  type Merchant as PrismaMerchant,
  type PaymentRequest as PrismaPaymentRequest,
  EntryType,
} from "@/generated/client/client.js";
import {
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import { WalletStatus } from "@/modules/wallets/domain/entities/wallet.entity.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import { LedgerAccountType } from "@/modules/ledger/domain/entities/ledger-account.entity.js";
import {
  TransactionStatus,
  TransactionType,
} from "@/modules/transaction/domain/entities/transaction.entity.js";
import { PaymentRequestStatus } from "../../domain/entities/payment-request.entity.js";
import type { PaymentRequestReferenceGenerator } from "../../application/ports/payment-request-reference-generator.js";

const TEST_PREFIX = "approve-payment-request-it";

const repositoryFactory = new PrismaRepositoryFactory();
const prismaUnitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);

class TestPaymentRequestReferenceGenerator implements PaymentRequestReferenceGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;
    return `${TEST_PREFIX}-${this.counter}-${randomUUID()}`;
  }
}

const referenceGenerator = new TestPaymentRequestReferenceGenerator();

const useCase = new ApprovePaymentRequestUseCase(
  prismaUnitOfWork,
  referenceGenerator,
);

async function createTestUser(suffix: string): Promise<PrismaUser> {
  return prisma.user.create({
    data: {
      id: `${TEST_PREFIX}-USER-${suffix}`,
      firebaseUid: `${TEST_PREFIX}-FIREBASEUID-${suffix}`,
      phoneNumber: `+233541${String(100000 + Number(randomUUID().replace(/\D/g, "")) || 1)}`,
      role: UserRole.INDIVIDUAL,
      status: UserStatus.ACTIVE,
    },
  });
}

async function createTestWallet(params: {
  userId: string;
  balanceMinor: bigint;
}): Promise<PrismaWallet> {
  return prisma.wallet.create({
    data: {
      userId: params.userId,
      currency: Currency.GHS,
      status: WalletStatus.ACTIVE,
      balanceMinor: params.balanceMinor,
    },
  });
}

async function createTestLedgerAccount(
  walletId: string,
): Promise<PrismaLedgerAccount> {
  return prisma.ledgerAccount.create({
    data: {
      walletId,
      accountType: LedgerAccountType.WALLET,
    },
  });
}

async function createTestMerchant(userId: string): Promise<PrismaMerchant> {
  return prisma.merchant.create({
    data: {
      userId,
      businessName: "Integration Test Merchant",
      status: "ACTIVE",
    },
  });
}

async function createTestFeeLedgerAccount(): Promise<PrismaLedgerAccount> {
  return prisma.ledgerAccount.create({
    data: {
      accountType: LedgerAccountType.REVENUE,
      code: "SFC_PAYMENT_FEES",
    },
  });
}

async function createTestPaymentRequest(params: {
  requesterId: string;
}): Promise<PrismaPaymentRequest> {
  return prisma.paymentRequest.create({
    data: {
      requesterId: params.requesterId,

      amount: 10_000n,

      feeAmount: 40n,

      totalAmount: 10_040n,

      currency: "GHS",

      reference: `${TEST_PREFIX}request-${crypto.randomUUID()}`,

      status: "PENDING",

      expiresAt: new Date(Date.now() + 60_000),
    },
  });
}

describe("ApprovePaymentRequestUsecase - integration", () => {
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

    await prisma.paymentRequest.deleteMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
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
        OR: [
          {
            code: "SFC_PAYMENT_FEES",
          },
          {
            wallet: {
              user: {
                firebaseUid: {
                  startsWith: TEST_PREFIX,
                },
              },
            },
          },
        ],
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

    await prisma.merchant.deleteMany({
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
    await prisma.$disconnect();
  });

  /** should execute a merchant payment atomically */
  it("should execute a merchant payment atomically", async () => {
    const sender = await createTestUser("sender-123");
    const senderWallet = await createTestWallet({
      userId: sender.id,
      balanceMinor: 20_000n,
    });

    const merchant = await createTestUser("merchant-123");
    const merchantWallet = await createTestWallet({
      userId: merchant.id,
      balanceMinor: 5_000n,
    });
    await createTestMerchant(merchant.id);

    // create necessary ledger accounts
    const senderLedger = await createTestLedgerAccount(senderWallet.id);
    const merchantLedger = await createTestLedgerAccount(merchantWallet.id);
    const feeLedger = await createTestFeeLedgerAccount();

    // create a payment request
    const paymentRequest = await createTestPaymentRequest({
      requesterId: merchant.id,
    });

    //approve the payment request
    const transaction = await useCase.execute(sender.id, paymentRequest.id);

    /** TRANSACTION */
    expect(transaction).not.toBeNull();
    expect(transaction.type).toBe(TransactionType.PAYMENT);
    expect(transaction.status).toBe(TransactionStatus.COMPLETED);
    expect(transaction.initiatedBy).toBe(sender.id);
    expect(transaction.currency).toBe(Currency.GHS);
    expect(transaction.amount).toBe(10_040n);

    /** WALLETS BALANCES */
    const senderWalletAfter = await prisma.wallet.findUnique({
      where: {
        userId: sender.id,
      },
    });
    const merchantWalletAfter = await prisma.wallet.findUnique({
      where: {
        userId: merchant.id,
      },
    });

    expect(senderWalletAfter?.balanceMinor).toBe(9_960n);
    expect(merchantWalletAfter?.balanceMinor).toBe(15_000n);

    /** PAYMENT REQUEST */
    const paymentRequestAfter = await prisma.paymentRequest.findUnique({
      where: {
        id: paymentRequest.id,
      },
    });

    expect(paymentRequestAfter?.status).toBe(PaymentRequestStatus.COMPLETED);
    expect(paymentRequestAfter?.transactionId).toBe(transaction.id);

    /** ledger entries */
    const entries = await prisma.ledgerEntry.findMany({
      where: {
        transactionId: transaction.id,
      },
    });

    expect(entries).toHaveLength(3);

    const senderDebit = entries.find(
      (entry) => entry.entryType === EntryType.DEBIT,
    );

    const merchantCredit = entries.find(
      (entry) =>
        entry.entryType === EntryType.CREDIT &&
        entry.ledgerAccountId === merchantLedger.id,
    );

    const feeCredit = entries.find(
      (entry) =>
        entry.entryType === EntryType.CREDIT &&
        entry.ledgerAccountId === feeLedger.id,
    );

    expect(senderDebit).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: senderLedger.id,
      entryType: EntryType.DEBIT,
      amount: 10_040n,
    });

    expect(merchantCredit).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: merchantLedger.id,
      entryType: EntryType.CREDIT,
      amount: 10_000n,
    });

    expect(feeCredit).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: feeLedger.id,
      entryType: EntryType.CREDIT,
      amount: 40n,
    });

    /*
     * Double-entry invariant:
     *
     * 10,040 debit
     * 10,000 merchant credit
     *     40 fee credit
     */
    const debitTotal = entries
      .filter((entry) => entry.entryType === EntryType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount, 0n);

    const creditTotal = entries
      .filter((entry) => entry.entryType === EntryType.CREDIT)
      .reduce((sum, entry) => sum + entry.amount, 0n);

    expect(debitTotal).toBe(creditTotal);
  });

  /** should reject approval when sender has insufficient funds */

  it("should execute a merchant payment atomically", async () => {
    const sender = await createTestUser("sender-1");

    const merchantUser = await createTestUser("merchant-1");

    await createTestMerchant(merchantUser.id);

    const senderWallet = await createTestWallet({
      userId: sender.id,
      balanceMinor: 20_000n,
    });

    const merchantWallet = await createTestWallet({
      userId: merchantUser.id,
      balanceMinor: 2_000n,
    });

    const senderLedger = await createTestLedgerAccount(senderWallet.id);

    const merchantLedger = await createTestLedgerAccount(merchantWallet.id);

    const feeLedger = await createTestFeeLedgerAccount();

    const request = await createTestPaymentRequest({
      requesterId: merchantUser.id,
    });

    const transaction = await useCase.execute(sender.id, request.id);

    /*
     * Transaction
     */
    expect(transaction.type).toBe("PAYMENT");

    expect(transaction.status).toBe("COMPLETED");

    expect(transaction.amount).toBe(10_040n);

    expect(transaction.currency).toBe(Currency.GHS);

    expect(transaction.initiatedBy).toBe(sender.id);

    /*
     * Wallet balances
     */
    const senderAfter = await prisma.wallet.findUnique({
      where: {
        id: senderWallet.id,
      },
    });

    const merchantAfter = await prisma.wallet.findUnique({
      where: {
        id: merchantWallet.id,
      },
    });

    expect(senderAfter?.balanceMinor).toBe(9_960n);

    expect(merchantAfter?.balanceMinor).toBe(12_000n);

    /*
     * Payment request
     */
    const requestAfter = await prisma.paymentRequest.findUnique({
      where: {
        id: request.id,
      },
    });

    expect(requestAfter?.status).toBe("COMPLETED");

    expect(requestAfter?.transactionId).toBe(transaction.id);

    /*
     * Transaction
     */
    const transactionAfter = await prisma.transaction.findUnique({
      where: {
        id: transaction.id,
      },
    });

    expect(transactionAfter).not.toBeNull();

    expect(transactionAfter?.amount).toBe(10_040n);

    /*
     * Ledger
     */
    const entries = await prisma.ledgerEntry.findMany({
      where: {
        transactionId: transaction.id,
      },
    });

    expect(entries).toHaveLength(3);

    const debit = entries.find((entry) => entry.entryType === EntryType.DEBIT);

    const merchantCredit = entries.find(
      (entry) =>
        entry.entryType === EntryType.CREDIT &&
        entry.ledgerAccountId === merchantLedger.id,
    );

    const feeCredit = entries.find(
      (entry) =>
        entry.entryType === EntryType.CREDIT &&
        entry.ledgerAccountId === feeLedger.id,
    );

    expect(debit).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: senderLedger.id,
      entryType: EntryType.DEBIT,
      amount: 10_040n,
    });

    expect(merchantCredit).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: merchantLedger.id,
      entryType: EntryType.CREDIT,
      amount: 10_000n,
    });

    expect(feeCredit).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: feeLedger.id,
      entryType: EntryType.CREDIT,
      amount: 40n,
    });

    /*
     * Double-entry invariant:
     *
     * 10,040 debit
     * 10,000 merchant credit
     *     40 fee credit
     */
    const debitTotal = entries
      .filter((entry) => entry.entryType === EntryType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount, 0n);

    const creditTotal = entries
      .filter((entry) => entry.entryType === EntryType.CREDIT)
      .reduce((sum, entry) => sum + entry.amount, 0n);

    expect(debitTotal).toBe(creditTotal);
  });

  /** should reject approval when sender has insufficient funds */
  it("should reject approval when sender has insufficient funds", async () => {
    const sender = await createTestUser("insufficient-sender");

    const merchantUser = await createTestUser("insufficient-merchant");

    await createTestMerchant(merchantUser.id);

    const senderWallet = await createTestWallet({
      userId: sender.id,
      balanceMinor: 5_000n,
    });

    const merchantWallet = await createTestWallet({
      userId: merchantUser.id,
      balanceMinor: 2_000n,
    });

    await createTestLedgerAccount(senderWallet.id);

    await createTestLedgerAccount(merchantWallet.id);

    await createTestFeeLedgerAccount();

    const request = await createTestPaymentRequest({
      requesterId: merchantUser.id,
    });

    await expect(useCase.execute(sender.id, request.id)).rejects.toThrow(
      "Insufficient funds or wallet unavailable.",
    );

    const senderAfter = await prisma.wallet.findUnique({
      where: {
        id: senderWallet.id,
      },
    });

    const merchantAfter = await prisma.wallet.findUnique({
      where: {
        id: merchantWallet.id,
      },
    });

    expect(senderAfter?.balanceMinor).toBe(5_000n);

    expect(merchantAfter?.balanceMinor).toBe(2_000n);

    expect(
      await prisma.transaction.count({
        where: {
          reference: {
            startsWith: TEST_PREFIX,
          },
        },
      }),
    ).toBe(0);

    const requestAfter = await prisma.paymentRequest.findUnique({
      where: {
        id: request.id,
      },
    });

    expect(requestAfter?.status).toBe("PENDING");
  });

  /** should allow only one concurrent approval */
  it("should allow only one concurrent approval", async () => {
    const sender = await createTestUser("concurrent-sender");

    const merchantUser = await createTestUser("concurrent-merchant");

    await createTestMerchant(merchantUser.id);

    const senderWallet = await createTestWallet({
      userId: sender.id,
      balanceMinor: 30_000n,
    });

    const merchantWallet = await createTestWallet({
      userId: merchantUser.id,
      balanceMinor: 2_000n,
    });

    await createTestLedgerAccount(senderWallet.id);

    await createTestLedgerAccount(merchantWallet.id);

    await createTestFeeLedgerAccount();

    const request = await createTestPaymentRequest({
      requesterId: merchantUser.id,
    });

    const results = await Promise.allSettled([
      useCase.execute(sender.id, request.id),
      useCase.execute(sender.id, request.id),
    ]);

    const successful = results.filter(
      (result) => result.status === "fulfilled",
    );

    const failed = results.filter((result) => result.status === "rejected");

    expect(successful).toHaveLength(1);
    expect(failed).toHaveLength(1);

    const requestAfter = await prisma.paymentRequest.findUnique({
      where: {
        id: request.id,
      },
    });

    expect(requestAfter?.status).toBe("COMPLETED");

    expect(requestAfter?.transactionId).not.toBeNull();

    const transactions = await prisma.transaction.findMany({
      where: {
        reference: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    expect(transactions).toHaveLength(1);

    const entries = await prisma.ledgerEntry.findMany({
      where: {
        transactionId: requestAfter!.transactionId!,
      },
    });

    expect(entries).toHaveLength(3);

    const senderAfter = await prisma.wallet.findUnique({
      where: {
        id: senderWallet.id,
      },
    });

    expect(senderAfter?.balanceMinor).toBe(19_960n);
  });
});
