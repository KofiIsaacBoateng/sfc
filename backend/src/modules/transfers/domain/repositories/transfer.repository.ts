import type { Transfer } from "../entities/transfer.entity.js";

export interface TransferRepository {
  /**
   * Creates a new money transfer entry
   * @param transfer
   * Returns the transfer
   */
  create(transfer: Transfer): Promise<Transfer>;

  /**
   * Finds a transfer by id
   * @param id
   * Returns null if transfer doesn't exist
   */
  findById(id: string): Promise<Transfer | null>;
}
