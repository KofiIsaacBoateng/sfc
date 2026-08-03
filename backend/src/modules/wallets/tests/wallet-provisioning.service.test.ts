import { describe, expect, vi, it } from "vitest";
import {
  Currency,
  Wallet,
} from "@/modules/wallets/domain/entities/wallet.entity.js";
import {
  WalletProvisioningService,
  type WalletProvisioningRepositories,
} from "@/modules/wallets/application/services/wallet-provisioning.service.js";
import type { WalletRepository } from "@/modules/wallets/domain/repositories/wallets.repository.js";
import type { LedgerAccountRepository } from "@/modules/ledger/domain/repositories/ledger-account.repository.js";
import { LedgerAccount } from "@/modules/ledger/domain/entities/ledger-account.entity.js";

describe("Wallet provisioning service", () => {
  it("should create wallet and ledger accounts", async () => {
    const wallet = Wallet.create("user-123", Currency.GHS);
    const createdWallet = Wallet.restore({
      id: "wallet-123",
      userId: wallet.userId,
      currency: Currency.GHS,
      balanceMinor: 2500,
      status: wallet.status,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    });

    const repos = {
      wallets: {
        create: vi.fn().mockResolvedValue(createdWallet),
      } as unknown as WalletRepository,
      ledger: {
        create: vi.fn().mockResolvedValue(LedgerAccount.create("wallet-123")),
      } as unknown as LedgerAccountRepository,
    } as WalletProvisioningRepositories;

    const service = new WalletProvisioningService();
    const results = await service.createDefaultWallet(repos, {
      userId: "user-123",
    });

    expect(repos.wallets.create).toHaveBeenCalledTimes(1);
    expect(repos.ledger.create).toHaveBeenCalledTimes(1);

    expect(results.id).toEqual("wallet-123");
  });
});
