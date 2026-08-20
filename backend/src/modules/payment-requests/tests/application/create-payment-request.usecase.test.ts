import { describe, expect, it, vi } from "vitest";

import {
  WalletStatus,
  Wallet,
} from "@/modules/wallets/domain/entities/wallet.entity.js";

import { PaymentRequestStatus } from "../../domain/entities/payment-request.entity.js";

import { CreatePaymentRequestUseCase } from "../../application/use-cases/create-payment-request.usecase.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

describe("CreatePaymentRequestUseCase", () => {
  function createMocks() {
    const wallets = {
      findByUserId: vi.fn(),
    };

    const paymentRequest = {
      create: vi.fn(),
    };

    const repos = {
      users: {},
      wallets,
      paymentRequest,
      merchants: {},
      ledgerAccounts: {},
      ledgerEntries: {},
      transactions: {},
      devices: {},
      provisionedDevices: {},
    };

    const unitOfWork = {
      execute: vi.fn(async (work) => work(repos as never)),
    };

    const referenceGenerator = {
      generate: vi.fn().mockReturnValue("SFC-REQ-TEST-001"),
    };

    return {
      wallets,
      paymentRequest,
      unitOfWork,
      referenceGenerator,
    };
  }

  function activeWallet() {
    return Wallet.restore({
      id: "wallet-1",
      userId: "user-1",
      status: WalletStatus.ACTIVE,
      balanceMinor: 10_000n,
      currency: Currency.GHS,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const dto = {
    amount: "5000",
    currency: Currency.GHS,
    expiresAt: new Date(Date.now() + 60_000),
  };

  it("should create a pending request", async () => {
    const mocks = createMocks();

    mocks.wallets.findByUserId.mockResolvedValue(activeWallet());

    mocks.paymentRequest.create.mockImplementation(async (request) => request);

    const useCase = new CreatePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    const result = await useCase.execute("user-1", dto);

    expect(result.status).toBe(PaymentRequestStatus.PENDING);

    expect(result.amount).toBe(5_000n);
    expect(result.feeAmount).toBe(0n);
    expect(result.totalAmount).toBe(5_000n);

    expect(result.reference).toBe("SFC-REQ-TEST-001");

    expect(mocks.referenceGenerator.generate).toHaveBeenCalledOnce();

    expect(mocks.paymentRequest.create).toHaveBeenCalledOnce();
  });

  it("should reject when wallet does not exist", async () => {
    const mocks = createMocks();

    mocks.wallets.findByUserId.mockResolvedValue(null);

    const useCase = new CreatePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("user-1", dto)).rejects.toThrow(
      "Requester wallet not found.",
    );
  });

  it("should reject an inactive wallet", async () => {
    const mocks = createMocks();
    const wallet = activeWallet();

    mocks.wallets.findByUserId.mockResolvedValue(
      Wallet.restore({
        id: wallet.id,
        userId: wallet.userId,
        currency: wallet.currency,
        balanceMinor: wallet.balanceMinor,
        status: WalletStatus.LOCKED,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      }),
    );

    const useCase = new CreatePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("user-1", dto)).rejects.toThrow(
      "Requester wallet is not active.",
    );
  });

  it("should reject invalid expiry", async () => {
    const mocks = createMocks();

    mocks.wallets.findByUserId.mockResolvedValue(activeWallet());

    const useCase = new CreatePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(
      useCase.execute("user-1", {
        ...dto,
        expiresAt: "not-a-date" as unknown as Date,
      }),
    ).rejects.toThrow("Invalid expiry date.");
  });

  it("should reject an expired request", async () => {
    const mocks = createMocks();

    mocks.wallets.findByUserId.mockResolvedValue(activeWallet());

    const useCase = new CreatePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(
      useCase.execute("user-1", {
        ...dto,
        expiresAt: new Date(Date.now() - 60_000),
      }),
    ).rejects.toThrow();
  });

  it("should reject a currency mismatch", async () => {
    const mocks = createMocks();

    mocks.wallets.findByUserId.mockResolvedValue(activeWallet());

    const useCase = new CreatePaymentRequestUseCase(
      mocks.unitOfWork as never,
      mocks.referenceGenerator,
    );

    await expect(
      useCase.execute("user-1", {
        ...dto,
        currency: "USD" as Currency,
      }),
    ).rejects.toThrow("Currency mismatch.");
  });
});
