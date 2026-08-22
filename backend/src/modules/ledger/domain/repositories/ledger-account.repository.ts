import { LedgerAccount } from "../entities/ledger-account.entity.js";

export interface LedgerAccountRepository {
  /**
   * Finds a ledger account by walletId
   * @param walletId
   * Returns null if ledger account doesn't exist
   */
  findByWalletId(walletId: string): Promise<LedgerAccount | null>;

  /**
   * Find a ledger account by code
   * @param code
   * Returns null if ledger account doesn't exist
   */
  findByCode(code: string): Promise<LedgerAccount | null>;

  /**
   * Persists a new ledger account
   * @param account
   */
  create(account: LedgerAccount): Promise<LedgerAccount>;
}
