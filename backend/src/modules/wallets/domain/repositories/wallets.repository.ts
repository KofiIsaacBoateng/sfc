import { Wallet } from "../entities/wallet.entity.js";

export interface WalletRepository {
  /**
   * Finds a wallet by a unique ID
   * @param id
   * Returns null if wallet is missing
   */
  findById(id: string): Promise<Wallet | null>;

  /**
   * Finds a wallet by User ID
   * @param userId
   * Returns null id wallet is missing
   */
  findByUserId(userId: string): Promise<Wallet | null>;

  /**
   * Persists a new wallet
   * @param wallet
   */
  create(wallet: Wallet): Promise<Wallet>;

  /**
   * Persists changes made to a existing user
   * @param wallet
   */
  update(wallet: Wallet): Promise<Wallet>;

  /**
   * Persists debit operation to wallet balance minor
   * @param walletId
   * @param amountMinor
   */
  debit(walletId: string, amountMinor: number): Promise<void>;

  /**
   * Persists credit operation to wallet balance minor
   * @param walletId
   * @param amountMinor
   */
  credit(walletId: string, amountMinor: number): Promise<void>;
}
