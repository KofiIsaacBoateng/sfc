import { Wallet } from "../../domain/entities/wallet.entity.js";
import { LedgerAccount } from "@/modules/ledger/domain/entities/ledger-account.entity.js";
import type { WalletRepository } from "../../domain/repositories/wallets.repository.js";
import type { LedgerAccountRepository } from "@/modules/ledger/domain/repositories/ledger-account.repository.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

interface DefaultWalletInput {
  userId: string;
}

export interface WalletProvisioningRepositories {
  wallets: WalletRepository;
  ledger: LedgerAccountRepository;
}

export class WalletProvisioningService {
  async createDefaultWallet(
    repos: WalletProvisioningRepositories,
    input: DefaultWalletInput,
  ): Promise<Wallet> {
    const wallet = Wallet.create(input.userId, Currency.GHS);

    const createdWallet = await repos.wallets.create(wallet);

    const ledgerAccount = LedgerAccount.createWalletAccount(createdWallet.id);
    await repos.ledger.create(ledgerAccount);

    return createdWallet;
  }
}
