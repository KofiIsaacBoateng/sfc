import { describe, expect, it, vi } from "vitest";

import { EntryType } from "@/generated/client/client.js";

import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

import {
  PaymentRequest,
  PaymentRequestStatus,
} from "../../domain/entities/payment-request.entity.js";

import { ApprovePaymentRequestUseCase } from "../../application/use-cases/approve-payment-request.usecase.js";

describe("ApprovePaymentRequestUseCase", () => {
  function createMocks() {
    const paymentRequest = {
      claimPending: vi.fn(),
      update: vi.fn(),
    };

    const wallets = {
      findByUserId: vi.fn(),
      debit: vi.fn(),
      credit: vi.fn(),
    };

    const ledger = {
      findByWalletId: vi.fn(),
      findByCode: vi.fn(),
    };

    const transaction = {
      create: vi.fn(),
    };

    const ledgerEntries = {
      create: vi.fn(),
    };

    const repos = {
      users: {},
      merchants: {},
      wallets,
      paymentRequest,
      ledger,
      ledgerEntries,
      transaction,
      devices: {},
      provisionedDevices: {},
    };

    const unitOfWork = {
      execute: vi.fn(async (work) => work(repos as never)),
    };

    const referenceGenerator = {
      generate: vi.fn().mockReturnValue("SFC-TXN-TEST-001"),
    };

    return {
      paymentRequest,
      wallets,
      ledger,
      transaction,
      ledgerEntries,
      unitOfWork,
      referenceGenerator,
    };
  }

  function processingRequest() {
    return PaymentRequest.restore({
      id: "request-1",
      requesterId: "merchant-user",
      amount: 10_000n,
      feeAmount: 40n,
      totalAmount: 10_040n,
      currency: Currency.GHS,
      reference: "SFC-REQ-001",
      status: PaymentRequestStatus.PROCESSING,
      expiresAt: new Date(Date.now() + 60_000),
      transactionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  function prepareSuccessfulApproval(mocks: ReturnType<typeof createMocks>) {
    mocks.paymentRequest.claimPending.mockResolvedValue(processingRequest());

    mocks.wallets.findByUserId
      .mockResolvedValueOnce({
        id: "sender-wallet",
        userId: "sender-user",
        currency: Currency.GHS,
        isActive: () => true,
      })
      .mockResolvedValueOnce({
        id: "merchant-wallet",
        userId: "merchant-user",
        currency: Currency.GHS,
        isActive: () => true,
      });

    mocks.ledger.findByWalletId
      .mockResolvedValueOnce({
        id: "sender-ledger",
      })
      .mockResolvedValueOnce({
        id: "merchant-ledger",
      });

    mocks.ledger.findByCode.mockResolvedValue({
      id: "fee-ledger",
    });

    mocks.transaction.create.mockImplementation(
      async (transaction) => transaction,
    );
  }

  it("should execute a merchant payment", async () => {
    const mocks = createMocks();

    prepareSuccessfulApproval(mocks);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    const result = await useCase.execute("sender-user", "request-1");

    expect(result.amount).toBe(10_040n);

    expect(mocks.wallets.debit).toHaveBeenCalledWith("sender-wallet", 10_040n);

    expect(mocks.wallets.credit).toHaveBeenCalledWith(
      "merchant-wallet",
      10_000n,
    );

    expect(mocks.ledgerEntries.create).toHaveBeenCalledTimes(3);

    expect(mocks.paymentRequest.update).toHaveBeenCalledOnce();
  });

  it("should create the correct debit entry", async () => {
    const mocks = createMocks();

    prepareSuccessfulApproval(mocks);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    const transaction = await useCase.execute("sender-user", "request-1");

    expect(mocks.ledgerEntries.create).toHaveBeenCalledWith({
      transactionId: transaction.id,
      ledgerAccountId: "sender-ledger",
      entryType: EntryType.DEBIT,
      amount: 10_040n,
    });
  });

  it("should create the merchant credit", async () => {
    const mocks = createMocks();

    prepareSuccessfulApproval(mocks);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    const transaction = await useCase.execute("sender-user", "request-1");

    expect(mocks.ledgerEntries.create).toHaveBeenCalledWith({
      transactionId: transaction.id,
      ledgerAccountId: "merchant-ledger",
      entryType: EntryType.CREDIT,
      amount: 10_000n,
    });
  });

  it("should create the SFC fee credit", async () => {
    const mocks = createMocks();

    prepareSuccessfulApproval(mocks);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    const transaction = await useCase.execute("sender-user", "request-1");

    expect(mocks.ledgerEntries.create).toHaveBeenCalledWith({
      transactionId: transaction.id,
      ledgerAccountId: "fee-ledger",
      entryType: EntryType.CREDIT,
      amount: 40n,
    });
  });

  it("should reject an unavailable payment request", async () => {
    const mocks = createMocks();

    mocks.paymentRequest.claimPending.mockResolvedValue(null);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("sender-user", "request-1")).rejects.toThrow(
      "Payment request is unavailable, expired, or already being processed.",
    );
  });

  it("should reject merchant self-payment", async () => {
    const mocks = createMocks();

    mocks.paymentRequest.claimPending.mockResolvedValue(processingRequest());

    mocks.wallets.findByUserId.mockResolvedValue({
      id: "merchant-wallet",
      userId: "merchant-user",
      currency: Currency.GHS,
      isActive: () => true,
    });

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("merchant-user", "request-1")).rejects.toThrow(
      "Cannot approve your own payment request.",
    );
  });

  it("should reject an inactive sender wallet", async () => {
    const mocks = createMocks();

    mocks.paymentRequest.claimPending.mockResolvedValue(processingRequest());

    mocks.wallets.findByUserId.mockResolvedValueOnce({
      id: "sender-wallet",
      userId: "sender-user",
      currency: Currency.GHS,
      isActive: () => false,
    });

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("sender-user", "request-1")).rejects.toThrow(
      "Sender wallet is not active.",
    );
  });

  it("should reject currency mismatch", async () => {
    const mocks = createMocks();
    const req = processingRequest();
    const request = PaymentRequest.restore({
      id: req.id,
      reference: req.reference,
      amount: req.amount,
      feeAmount: req.feeAmount,
      totalAmount: req.totalAmount,
      requesterId: req.requesterId,
      status: req.status,
      expiresAt: req.expiresAt,
      transactionId: req.transactionId,
      currency: "USD" as Currency,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
    });

    mocks.paymentRequest.claimPending.mockResolvedValue(request);

    mocks.wallets.findByUserId.mockResolvedValue({
      id: "sender-wallet",
      userId: "sender-user",
      currency: Currency.GHS,
      isActive: () => true,
    });

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("sender-user", "request-1")).rejects.toThrow(
      "Currency mismatch.",
    );
  });

  it("should reject when the sender ledger account is missing", async () => {
    const mocks = createMocks();

    mocks.paymentRequest.claimPending.mockResolvedValue(processingRequest());

    mocks.wallets.findByUserId
      .mockResolvedValueOnce({
        id: "sender-wallet",
        userId: "sender-user",
        currency: Currency.GHS,
        isActive: () => true,
      })
      .mockResolvedValueOnce({
        id: "merchant-wallet",
        userId: "merchant-user",
        currency: Currency.GHS,
        isActive: () => true,
      });

    mocks.ledger.findByWalletId.mockResolvedValueOnce(null);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("sender-user", "request-1")).rejects.toThrow(
      "Sender ledger account not found.",
    );
  });

  it("should reject when the fee ledger account is missing", async () => {
    const mocks = createMocks();

    prepareSuccessfulApproval(mocks);

    mocks.ledger.findByCode.mockResolvedValue(null);

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("sender-user", "request-1")).rejects.toThrow(
      "SFC fee ledger account not found.",
    );
  });

  it("should propagate insufficient funds", async () => {
    const mocks = createMocks();

    prepareSuccessfulApproval(mocks);

    mocks.wallets.debit.mockRejectedValue(
      new Error("Insufficient funds or wallet unavailable."),
    );

    const useCase = new ApprovePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("sender-user", "request-1")).rejects.toThrow(
      "Insufficient funds or wallet unavailable.",
    );

    expect(mocks.transaction.create).not.toHaveBeenCalled();
  });
});
