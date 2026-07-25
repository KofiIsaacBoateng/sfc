import type { UserRepository } from "@/modules/users/domain/repositories/user.repository.js";
import type { LedgerAccountRepository } from "@/modules/ledger/domain/repositories/ledger-account.repository.js";
import type { WalletRepository } from "@/modules/wallets/domain/repositories/wallets.repository.js";

export interface Repositories {
  users: UserRepository;
  wallets: WalletRepository;
  ledger: LedgerAccountRepository;
}
