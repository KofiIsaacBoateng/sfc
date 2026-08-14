import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { TransferMoneyUseCase } from "../../application/use-cases/transfer-money.usecase.js";
import {
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import {
  Currency,
  WalletStatus,
} from "@/modules/wallets/domain/entities/wallet.entity.js";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  TransactionStatus,
  TransactionType,
} from "../../domain/entities/transaction.entity.js";
import { EntryType } from "@/generated/client/enums.js";
import type { TransactionReferenceGenerator } from "../../application/ports/transaction-reference-generator.js";

const repositoryFactory = new PrismaRepositoryFactory();
const prismaUnitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);

class TestTransactionReferenceGenerator implements TransactionReferenceGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;

    return `transfer-money-uc-it-${this.counter}`;
  }
}
const referenceGenerator = new TestTransactionReferenceGenerator();
const transferMoneyUseCase = new TransferMoneyUseCase(
  prismaUnitOfWork,
  referenceGenerator,
);

const TEST_PREFIX = "transfer-money-uc-it";

const createUser = async (param: {
  id: string;
  firebaseUid: string;
  phoneNumber: string;
}) => {
  return prisma.user.create({
    data: {
      id: `${TEST_PREFIX}-${param.id}`,
      firebaseUid: `${TEST_PREFIX}-${param.firebaseUid}`,
      phoneNumber: `${TEST_PREFIX}-${param.phoneNumber}`,
      displayName: "Test User",
      status: UserStatus.ACTIVE,
      role: UserRole.INDIVIDUAL,
    },
  });
};

const createWallet = async (param: {
  id: string;
  userId: string;
  balanceMinor: bigint;
}) => {
  return prisma.wallet.create({
    data: {
      id: `${TEST_PREFIX}-${param.id}`,
      userId: param.userId,
      currency: Currency.GHS,
      status: WalletStatus.ACTIVE,
      balanceMinor: param.balanceMinor,
    },
  });
};

const createLedgerAccount = async (param: { walletId: string }) => {
  return prisma.ledgerAccount.create({
    data: {
      walletId: param.walletId,
    },
  });
};

/** CLEAN DB FOR NEXT TEST CASE */
describe("TransferMoneyUseCase - integration", async () => {
  const testReferenceRegex = new RegExp(`^${TEST_PREFIX}.*\\d$`);
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

  /*** DISCONNECT DB AFER ALL TEST CASES RUN */
  afterAll(async () => {
    await prisma.$disconnect();
  });

  /** TEST CASES */

  /** it should transfer money and create the complete accounting record */
  it("should transfer money and create the complete accounting record", async () => {
    const sender = await createUser({
      id: "sender-123",
      firebaseUid: "sender-firebase-uid",
      phoneNumber: "+233543126789",
    });

    const recipient = await createUser({
      id: "recipient-123",
      firebaseUid: "recipient-firebase-uid",
      phoneNumber: "+233541236789",
    });

    const senderWalletBefore = await createWallet({
      id: "sender-wallet",
      userId: sender.id,
      balanceMinor: 10_000n,
    });
    const recipientWalletBefore = await createWallet({
      id: "recipient-wallet",
      userId: recipient.id,
      balanceMinor: 3_000n,
    });

    const senderLedgerAccount = await createLedgerAccount({
      walletId: senderWalletBefore.id,
    });
    const recipientLedgerAccount = await createLedgerAccount({
      walletId: recipientWalletBefore.id,
    });

    const transaction = await transferMoneyUseCase.execute(sender.id, {
      recipientWalletId: recipientWalletBefore.id,
      currency: Currency.GHS,
      amount: "5000",
    });

    /** Returns the right transaction record */
    expect(transaction.type).toBe(TransactionType.PAYMENT);
    expect(transaction.amount).toBe(5_000n);
    expect(transaction.initiatedBy).toBe(sender.id);
    expect(transaction.reference).toMatch(testReferenceRegex);
    expect(transaction.status).toBe(TransactionStatus.COMPLETED);

    const senderWalletAfer = await prisma.wallet.findUnique({
      where: {
        id: senderWalletBefore.id,
      },
    });
    const recipientWalletAfter = await prisma.wallet.findUnique({
      where: {
        id: recipientWalletBefore.id,
      },
    });

    /** sender and recipient wallets get rightly debited and credited, and persisted */
    expect(senderWalletAfer?.balanceMinor).toBe(5_000n);
    expect(recipientWalletAfter?.balanceMinor).toBe(8_000n);

    const persistedTransaction = await prisma.transaction.findUnique({
      where: {
        id: transaction.id,
      },
    });
    /** transaction is recorded */
    expect(persistedTransaction).not.toBeNull();

    const ledgerEntry = await prisma.ledgerEntry.findMany({
      where: {
        transactionId: transaction.id,
      },
    });

    expect(ledgerEntry.length).toBe(2);

    const creditEntry = ledgerEntry.find(
      (entry) => entry.entryType === EntryType.CREDIT,
    );
    const debitEntry = ledgerEntry.find(
      (entry) => entry.entryType === EntryType.DEBIT,
    );

    /** ledger records persisted? */
    expect(debitEntry).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: senderLedgerAccount.id,
      entryType: EntryType.DEBIT,
      amount: 5_000n,
    });

    expect(creditEntry).toMatchObject({
      transactionId: transaction.id,
      ledgerAccountId: recipientLedgerAccount.id,
      entryType: EntryType.CREDIT,
      amount: 5_000n,
    });

    /** credit amount === debit amount? */
    expect(creditEntry?.amount).toBe(debitEntry?.amount);
  });

  /** it should leave the DB unchanged when transfer fails */
  it("should leave the database unchanged when the transfer fails", async () => {
    const senderUser = await createUser({
      id: "failure-sender",
      firebaseUid: "sender-firebase-uid",
      phoneNumber: "+233541234573",
    });

    const recipientUser = await createUser({
      id: "failure-recipient",
      firebaseUid: "recipient-firebase-uid",
      phoneNumber: "+233541234574",
    });

    const senderWallet = await createWallet({
      id: "failure-sender-wallet",
      userId: senderUser.id,
      balanceMinor: 1_000n,
    });

    const recipientWallet = await createWallet({
      id: "failure-recipient-wallet",
      userId: recipientUser.id,
      balanceMinor: 2_000n,
    });

    await createLedgerAccount({ walletId: senderWallet.id });

    await createLedgerAccount({ walletId: recipientWallet.id });

    await expect(
      transferMoneyUseCase.execute(senderUser.id, {
        recipientWalletId: recipientWallet.id,
        amount: "5000",
        currency: Currency.GHS,
      }),
    ).rejects.toThrow("Insufficient funds or wallet unavailable.");

    const senderAfter = await prisma.wallet.findUnique({
      where: {
        id: senderWallet.id,
      },
    });

    const recipientAfter = await prisma.wallet.findUnique({
      where: {
        id: recipientWallet.id,
      },
    });

    expect(senderAfter?.balanceMinor).toBe(1_000n);

    expect(recipientAfter?.balanceMinor).toBe(2_000n);

    expect(
      await prisma.transaction.count({
        where: {
          reference: {
            startsWith: TEST_PREFIX,
          },
        },
      }),
    ).toBe(0);

    expect(
      await prisma.ledgerEntry.count({
        where: {
          transaction: {
            reference: {
              startsWith: TEST_PREFIX,
            },
          },
        },
      }),
    ).toBe(0);
  });

  /** it should not transfer to the same wallet */
  it("should not transfer to the same wallet", async () => {
    const user = await createUser({
      id: "self",
      firebaseUid: "self-firebase",
      phoneNumber: "+233541234575",
    });

    const wallet = await createWallet({
      id: "wallet-id",
      userId: user.id,
      balanceMinor: 10_000n,
    });

    await createLedgerAccount({ walletId: wallet.id });

    await expect(
      transferMoneyUseCase.execute(user.id, {
        recipientWalletId: wallet.id,
        amount: "5000",
        currency: Currency.GHS,
      }),
    ).rejects.toThrow("Cannot transfer to the same wallet.");
  });
});
