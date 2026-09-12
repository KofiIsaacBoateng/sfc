import type { Transaction } from "../entities/transaction.entity.js";

export interface TransactionRepository {
  /**
   * Finds a transaction by its id
   * @param id
   * Returns null if transaction doesn't exist
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Finds a transaction by the transaction's reference
   * @param ref
   * Returns null if the transaction doesn't exist.
   */
  findByReference(ref: string): Promise<Transaction | null>;

  /**
   * Finds all transactions belonging to a user
   * @param userId
   * Returns a list of transactions
   */
  findByUserId(
    userId: string,
    params?: {
      limit?: number;
      cursor?: string;
    },
  ): Promise<Transaction[]>;

  /**
   * Persists a transaction record in the database
   * @param transaction
   * Returns nothing
   */
  create(transaction: Transaction): Promise<Transaction>;
}
