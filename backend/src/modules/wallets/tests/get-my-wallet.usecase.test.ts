import { describe, expect, it, vi } from "vitest";
import { GetMyWalletUseCase } from "@/modules/wallets/application/use-case/get-my-wallet.usecase.js";
import type { WalletRepository } from "@/modules/wallets/domain/repositories/wallets.repository.js";
import NotFoundError from "@/shared/errors/not-found.js";
import {
  Wallet,
  WalletStatus,
} from "@/modules/wallets/domain/entities/wallet.entity.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

describe("Get My Wallet Usecase", () => {
  it("should throw NotFoundError when wallet doesn't exist", async () => {
    const walletRepository = {
      findByUserId: vi.fn().mockResolvedValue(null),
    };

    const usecase = new GetMyWalletUseCase(
      walletRepository as unknown as WalletRepository,
    );

    await expect(usecase.execute("user-123")).rejects.toThrow(NotFoundError);
  });

  it("should return a user's wallet", async () => {
    const wallet = Wallet.restore({
      id: "wallet-123",
      userId: "user-123",
      currency: Currency.GHS,
      balanceMinor: 25_000n,
      status: WalletStatus.ACTIVE,
      createdAt: new Date("2026-07-30:10:00:00.000Z"),
      updatedAt: new Date("2026-07-30:10:00:00.000Z"),
    });

    const walletRepository = {
      findByUserId: vi.fn().mockResolvedValue(wallet),
    };

    const usecase = new GetMyWalletUseCase(
      walletRepository as unknown as WalletRepository,
    );
    const result = await usecase.execute(wallet.userId);

    expect(walletRepository.findByUserId).toHaveBeenCalledWith("user-123");
    expect(result).toEqual({
      walletId: wallet.id,
      currency: wallet.currency,
      balanceMinor: wallet.balanceMinor,
      status: wallet.status,
    });
  });
});
