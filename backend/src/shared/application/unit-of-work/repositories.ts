import type { UserRepository } from "@/src/modules/users/domain/repositories/user.repository.js";
import type { LedgerAccountRepository } from "@/src/modules/ledger/domain/repositories/ledger-account.repository.js";
import type { WalletRepository } from "@/src/modules/wallets/domain/repositories/wallets.repository.js";

export interface Repositories {
  users: UserRepository;
  wallets: WalletRepository;
  ledger: LedgerAccountRepository;
}
