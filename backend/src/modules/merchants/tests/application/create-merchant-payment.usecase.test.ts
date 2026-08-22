import { describe, expect, it, vi } from "vitest";

import {
  WalletStatus,
  Wallet,
} from "@/modules/wallets/domain/entities/wallet.entity.js";

import { PaymentRequestStatus } from "@/modules/payment-requests/domain/entities/payment-request.entity.js";

import { CreateMerchantPaymentUseCase } from "../../application/use-cases/create-merchant-payment.usecase.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

describe("CreateMerchantPaymentUseCase", () => {
  function createMocks() {
    const merchant = {
      findByUserId: vi.fn(),
    };

    const wallets = {
      findByUserId: vi.fn(),
    };

    const paymentRequest = {
      create: vi.fn(),
    };

    const repos = {
      users: {},
      merchant,
      wallets,
      paymentRequest,
      ledgerAccounts: {},
      ledgerEntries: {},
      transactions: {},
      devices: {},
      provisionedDevices: {},
    };

    const unitOfWork = {
      execute: vi.fn(async (work) => work(repos as never)),
    };

    const chargePolicy = {
      calculateCharge: vi.fn().mockReturnValue(40n),
    };

    const referenceGenerator = {
      generate: vi.fn().mockReturnValue("SFC-REQ-MERCHANT-001"),
    };

    return {
      merchant,
      wallets,
      paymentRequest,
      unitOfWork,
      chargePolicy,
      referenceGenerator,
    };
  }

  function activeWallet() {
    return Wallet.restore({
      id: "merchant-wallet",
      userId: "merchant-user",
      status: WalletStatus.ACTIVE,
      balanceMinor: 0n,
      currency: Currency.GHS,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  function activeMerchant() {
    return {
      userId: "merchant-user",
      isActive: () => true,
    };
  }

  const dto = {
    amount: "10_000".replace("_", ""),
    currency: Currency.GHS,
    expiresAt: new Date(Date.now() + 60_000),
  };

  it("should create a merchant payment request", async () => {
    const mocks = createMocks();

    mocks.merchant.findByUserId.mockResolvedValue(activeMerchant());

    mocks.wallets.findByUserId.mockResolvedValue(activeWallet());

    mocks.paymentRequest.create.mockImplementation(async (request) => request);

    const useCase = new CreateMerchantPaymentUseCase(
      mocks.unitOfWork as never,
      mocks.chargePolicy,
      mocks.referenceGenerator,
    );

    const result = await useCase.execute("merchant-user", dto);

    expect(result.amount).toBe(10_000n);
    expect(result.feeAmount).toBe(40n);
    expect(result.totalAmount).toBe(10_040n);

    expect(result.status).toBe(PaymentRequestStatus.PENDING);

    expect(mocks.chargePolicy.calculateCharge).toHaveBeenCalledWith(10_000n);

    expect(mocks.paymentRequest.create).toHaveBeenCalledOnce();
  });

  it("should reject a non-existent merchant", async () => {
    const mocks = createMocks();

    mocks.merchant.findByUserId.mockResolvedValue(null);

    const useCase = new CreateMerchantPaymentUseCase(
      mocks.unitOfWork as never,
      mocks.chargePolicy,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("merchant-user", dto)).rejects.toThrow(
      "Merchant account not found.",
    );
  });

  it("should reject an inactive merchant", async () => {
    const mocks = createMocks();

    mocks.merchant.findByUserId.mockResolvedValue({
      userId: "merchant-user",
      isActive: () => false,
    });

    const useCase = new CreateMerchantPaymentUseCase(
      mocks.unitOfWork as never,
      mocks.chargePolicy,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("merchant-user", dto)).rejects.toThrow(
      "Merchant account is not active.",
    );
  });

  it("should reject a missing merchant wallet", async () => {
    const mocks = createMocks();

    mocks.merchant.findByUserId.mockResolvedValue(activeMerchant());

    mocks.wallets.findByUserId.mockResolvedValue(null);

    const useCase = new CreateMerchantPaymentUseCase(
      mocks.unitOfWork as never,
      mocks.chargePolicy,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("merchant-user", dto)).rejects.toThrow(
      "Merchant wallet not found.",
    );
  });

  it("should reject an inactive merchant wallet", async () => {
    const mocks = createMocks();
    const wallet = activeWallet();

    mocks.merchant.findByUserId.mockResolvedValue(activeMerchant());

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

    const useCase = new CreateMerchantPaymentUseCase(
      mocks.unitOfWork as never,
      mocks.chargePolicy,
      mocks.referenceGenerator,
    );

    await expect(useCase.execute("merchant-user", dto)).rejects.toThrow(
      "Merchant wallet is not active.",
    );
  });
});
