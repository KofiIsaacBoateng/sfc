import { describe, expect, it, vi } from "vitest";
import {
  Currency,
  WalletStatus,
  Wallet,
} from "@/modules/wallets/domain/entities/wallet.entity.js";
import { WalletController } from "@/modules/wallets/presentation/controllers/wallet.controller.js";
import type { GetMyWalletUseCase } from "@/modules/wallets/application/use-case/get-my-wallet.usecase.js";
import type { Request, Response } from "express";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";

vi.mock("@/shared/presentation/utils/response-formatter.js", () => ({
  sendSuccess: vi.fn(),
}));

describe("Wallet controller", () => {
  it("should call wallet use case and call sendSuccess with the right values", async () => {
    const wallet = Wallet.restore({
      id: "wallet-123",
      userId: "user-123",
      currency: Currency.GHS,
      balanceMinor: 25_000n,
      status: WalletStatus.ACTIVE,
      createdAt: new Date("2026-07-30:10:00:00.000Z"),
      updatedAt: new Date("2026-07-30:10:00:00.000Z"),
    });

    const req = {
      authUser: {
        userId: "user-123",
      },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const walletUseCase = {
      execute: vi.fn().mockResolvedValue(wallet),
    } as unknown as GetMyWalletUseCase;

    const walletController = new WalletController(
      walletUseCase as GetMyWalletUseCase,
    );
    await walletController.getMyWallet(req as Request, res as Response);

    expect(walletUseCase.execute).toHaveBeenCalledWith("user-123");
    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      wallet,
      "Wallet retrieved successfully",
    );
  });
});
