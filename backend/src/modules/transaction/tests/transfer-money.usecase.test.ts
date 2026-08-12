import { LedgerAccount } from "@/modules/ledger/domain/entities/ledger-account.entity.js";
import type { LedgerAccountRepository } from "@/modules/ledger/domain/repositories/ledger-account.repository.js";
import {
  Currency,
  Wallet,
  WalletStatus,
} from "@/modules/wallets/domain/entities/wallet.entity.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { WalletRepository } from "@/modules/wallets/domain/repositories/wallets.repository.js";
import type { TransactionRepository } from "../domain/repositories/transaction.repository.js";
import type { LedgerEntryRepository } from "@/modules/ledger/application/repository/ledger-entry.repository.js";
import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";
import type { UserRepository } from "@/modules/users/domain/repositories/user.repository.js";
import type { DeviceRepository } from "@/modules/devices/domain/repositories/device.repository.js";
import type { ProvisionedDeviceRepository } from "@/modules/devices/domain/repositories/provisioned-device.repository.js";
import { TransferMoneyUseCase } from "../application/use-cases/transfer-money.usecase.js";
import { TransactionType } from "../domain/entities/transaction.entity.js";
import { EntryType } from "@/generated/client/enums.js";
import type { TransferMoneyDto } from "../application/dto/transfer-money.dto.js";

describe("Transfer money usecase", () => {
  let senderUserId = "sender-id-123";
  let recipientUserId = "recipient-id-123";
  let senderWalletId = "wallet-sender-123";
  let recipientWalletId = "wallet-recipient-123";
  let dto: TransferMoneyDto;

  const amount = "5000";

  const senderWallet = Wallet.restore({
    id: senderWalletId,
    userId: senderUserId,
    status: WalletStatus.ACTIVE,
    currency: Currency.GHS,
    balanceMinor: 10_000n,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const recipientWallet = Wallet.restore({
    id: recipientWalletId,
    userId: recipientUserId,
    status: WalletStatus.ACTIVE,
    currency: Currency.GHS,
    balanceMinor: 2_000n,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const senderLedgerAccount = LedgerAccount.restore({
    id: "sender-ledger-account",
    walletId: senderWalletId,
    createdAt: new Date(),
  });

  const recipientLedgerAccount = LedgerAccount.restore({
    id: "recipient-ledger-account",
    walletId: recipientWalletId,
    createdAt: new Date(),
  });

  function createMocks() {
    const wallets: WalletRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      debit: vi.fn(),
      credit: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const ledgerAccount: LedgerAccountRepository = {
      findByWalletId: vi.fn(),
      create: vi.fn(),
    };

    const transaction: TransactionRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByReference: vi.fn(),
    };

    const ledgerEntries: LedgerEntryRepository = {
      create: vi.fn(),
    };

    const repos: Repositories = {
      wallets,
      ledger: ledgerAccount,
      transaction,
      ledgerEntries,
      users: {} as UserRepository,
      device: {} as DeviceRepository,
      provisionedDevice: {} as ProvisionedDeviceRepository,
    };

    const unitOfWork: UnitOfWork = {
      execute: vi.fn().mockImplementation(async (work) => work(repos)),
    };

    return {
      wallets,
      ledgerAccount,
      transaction,
      ledgerEntries,
      unitOfWork,
    };
  }

  function prepareSuccessfulTransfer(mocks: ReturnType<typeof createMocks>) {
    vi.mocked(mocks.wallets.findByUserId).mockResolvedValue(senderWallet);

    vi.mocked(mocks.wallets.findById).mockResolvedValue(recipientWallet);

    vi.mocked(mocks.ledgerAccount.findByWalletId).mockResolvedValueOnce(
      senderLedgerAccount,
    );
    vi.mocked(mocks.ledgerAccount.findByWalletId).mockResolvedValueOnce(
      recipientLedgerAccount,
    );

    vi.mocked(mocks.transaction.create).mockImplementation(
      async (transaction) => transaction,
    );
  }

  beforeEach(() => {
    dto = {
      recipientWalletId,
      amount,
      currency: Currency.GHS,
    };
  });

  /** it should successfully transfer money */
  it("should successfully transfer money", async () => {
    const mocks = createMocks();

    // prepare successful transfer
    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);

    const transaction = await useCase.execute(senderUserId, dto);

    expect(transaction).toBeDefined();
    expect(transaction.type).toBe(TransactionType.PAYMENT);
    expect(transaction.amount).toBe(5_000n);
    expect(transaction.initiatedBy).toBe(senderUserId);
    expect(transaction.currency).toBe(Currency.GHS);
  });

  /** it should debit the sender */
  it("should debeit the sender", async () => {
    const mocks = createMocks();
    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);
    await useCase.execute(senderUserId, dto);

    expect(mocks.wallets.debit).toHaveBeenCalledWith(senderWalletId, 5_000n);
  });

  /** it should credit the recipient */
  it("should credit the recipient", async () => {
    const mocks = createMocks();
    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);
    await useCase.execute(senderUserId, dto);

    expect(mocks.wallets.credit).toHaveBeenCalledWith(
      recipientWalletId,
      5_000n,
    );
  });

  /** it should create a payment transaction */
  it("should create a payment transaction", async () => {
    const mocks = createMocks();
    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);
    await useCase.execute(senderUserId, dto);

    expect(mocks.transaction.create).toHaveBeenCalledTimes(1);

    expect(mocks.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TransactionType.PAYMENT,
        amount: 5_000n,
        initiatedBy: senderUserId,
        reference: expect.stringMatching(/^SFC-/),
      }),
    );
  });

  /** it should create a debit ledger entry */
  it("should create debit ledger entry", async () => {
    const mocks = createMocks();
    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);
    const transaction = await useCase.execute(senderUserId, dto);

    expect(mocks.ledgerEntries.create).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: transaction.id,
        ledgerAccountId: senderLedgerAccount.id,
        entryType: EntryType.DEBIT,
        amount: 5_000n,
      }),
    );
  });

  /** it should create a credit ledger entry */
  it("should create credit ledger entry", async () => {
    const mocks = createMocks();
    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);
    const transaction = await useCase.execute(senderUserId, dto);

    expect(mocks.ledgerEntries.create).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: transaction.id,
        ledgerAccountId: recipientLedgerAccount.id,
        entryType: EntryType.CREDIT,
        amount: 5_000n,
      }),
    );
  });

  /** it should reject when sender wallet doesn't exist */
  it("should reject when sender wallet doesn't exist", async () => {
    const mocks = createMocks();
    vi.mocked(mocks.wallets.findByUserId).mockResolvedValue(null);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);

    await expect(useCase.execute(senderUserId, dto)).rejects.toThrow(
      "Sender wallet not found.",
    );
  });

  /** it should reject when recipient wallet doesn't exist */
  it("should reject when recipient wallet doesn't exist", async () => {
    const mocks = createMocks();
    vi.mocked(mocks.wallets.findByUserId).mockResolvedValue(senderWallet);
    vi.mocked(mocks.wallets.findById).mockResolvedValue(null);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);

    await expect(useCase.execute(senderUserId, dto)).rejects.toThrow(
      "Recipient wallet not found.",
    );
  });

  /** it should reject transfer to the same wallet */
  it("should reject transfer to the same wallet", async () => {
    const mocks = createMocks();

    vi.mocked(mocks.wallets.findByUserId).mockResolvedValue(senderWallet);
    vi.mocked(mocks.wallets.findById).mockResolvedValue(senderWallet);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);

    await expect(useCase.execute(senderUserId, dto)).rejects.toThrow(
      "Cannot transfer from a wallet to itself",
    );
  });

  /** it should reject when the sender's wallet is inactive */
  it("should reject when the sender's wallet is inactive", async () => {
    const mocks = createMocks();
    const lockedSenderWallet = Wallet.restore({
      id: senderWalletId,
      userId: senderUserId,
      status: WalletStatus.LOCKED,
      currency: Currency.GHS,
      balanceMinor: 10_000n,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mocks.wallets.findByUserId).mockResolvedValue(lockedSenderWallet);
    vi.mocked(mocks.wallets.findById).mockResolvedValue(recipientWallet);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);

    await expect(useCase.execute(senderUserId, dto)).rejects.toThrow(
      "Sender wallet is inactive.",
    );
  });

  /** it should reject when the recipient's wallet is inactive */
  it("should reject when the recipient's wallet is inactive", async () => {
    const mocks = createMocks();
    const lockedRecipientWallet = Wallet.restore({
      id: recipientWalletId,
      userId: recipientUserId,
      status: WalletStatus.LOCKED,
      currency: Currency.GHS,
      balanceMinor: 10_000n,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mocks.wallets.findByUserId).mockResolvedValue(senderWallet);
    vi.mocked(mocks.wallets.findById).mockResolvedValue(lockedRecipientWallet);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork);

    await expect(useCase.execute(senderUserId, dto)).rejects.toThrow(
      "Recipient wallet is inactive.",
    );
  });

  /** it should reject when currencies do not match */
  //   it("should reject when currencies do not match", async () => {
  //     const mocks = createMocks();

  //     prepareSuccessfulTransfer(mocks);

  //     const useCase = new TransferMoneyUseCase(mocks.unitOfWork as any);

  //     await expect(
  //       useCase.execute(senderUserId, {
  //         recipientWalletId,
  //         amount,
  //         currency: "USD" as Currency,
  //       }),
  //     ).rejects.toThrow("Sender wallet currency mismatch.");
  //   });

  /** it should reject non-positive amount */
  it("should reject a non-positive amount", async () => {
    const mocks = createMocks();

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork as any);

    await expect(
      useCase.execute(senderUserId, {
        recipientWalletId,
        amount: "0",
        currency: Currency.GHS,
      }),
    ).rejects.toThrow("Transfer amount must be greater than zero.");
  });

  /** it should execute the transfer through the unit of work */
  it("should execute the transfer through the unit of work", async () => {
    const mocks = createMocks();

    prepareSuccessfulTransfer(mocks);

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork as any);

    await useCase.execute(senderUserId, {
      recipientWalletId,
      amount,
      currency: Currency.GHS,
    });

    expect(mocks.unitOfWork.execute).toHaveBeenCalledTimes(1);
  });

  /** it should propagate an error when ledger entry creation fails */
  it("should propagate an error when ledger entry creation fails", async () => {
    const mocks = createMocks();

    prepareSuccessfulTransfer(mocks);

    vi.mocked(mocks.ledgerEntries.create).mockRejectedValue(
      new Error("Ledger failure"),
    );

    const useCase = new TransferMoneyUseCase(mocks.unitOfWork as any);

    await expect(
      useCase.execute(senderUserId, {
        recipientWalletId,
        amount,
        currency: Currency.GHS,
      }),
    ).rejects.toThrow("Ledger failure");
  });
});
