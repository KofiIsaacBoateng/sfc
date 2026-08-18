import type { Merchant } from "../entities/merchant.entity.js";

export interface MerchantRepository {
  /**
   * Find a merchant profile by id
   * @param id
   * Returns null if merchant's profile doesn't exist
   */
  findById(id: string): Promise<Merchant | null>;

  /**
   * Find a merchant profile by their userId
   * @param userId
   * Returns null if merchant's profile doesn't exist
   */
  findByUserId(userId: string): Promise<Merchant | null>;

  /**
   * Crate a new merchant profile
   * @param merchant
   * Returns a new merchant
   */
  create(merchant: Merchant): Promise<Merchant>;

  /**
   * Persists merchant data in the db
   * @param merchant
   * Returns the new update
   */
  update(merchant: Merchant): Promise<Merchant>;
}
