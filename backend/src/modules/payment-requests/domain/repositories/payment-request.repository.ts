import type { PaymentRequest } from "../entities/payment-request.entity.js";

export interface PaymentRequestRepository {
  /**
   * Finds a payment request by id
   * @param id
   * Returns null if payment request doesn't exist
   */
  findById(id: string): Promise<PaymentRequest | null>;

  /**
   * Find payment by the unique constraints: requesterId and idempotencyKey
   * @param requesterId
   * @param idempotencyKey
   * Returns null if payment request doesn't exist
   */
  findByIdempotencyKey(
    requesterId: string,
    idempotencyKey: string,
  ): Promise<PaymentRequest | null>;

  /**
   * Persists payment request
   * @param request
   * Returns a newly created payment request
   */
  create(request: PaymentRequest): Promise<PaymentRequest>;

  /**
   * Persists an updated payment request
   * @param request
   * Returns the new update
   */
  update(request: PaymentRequest): Promise<PaymentRequest>;

  /**
   * Tag payment request as processing
   * @param request
   * Returns nothing
   */
  claimPending(requestId: string): Promise<PaymentRequest | null>;

  /**
   * Persist all expired requests as EXPIRED
   * @param data
   * Returns the number of expired payment requests
   */
  expirePending(now: Date): Promise<number>;
}
