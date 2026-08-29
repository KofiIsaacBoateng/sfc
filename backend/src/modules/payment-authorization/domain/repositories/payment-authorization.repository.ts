import type { PaymentAuthorization } from "../entities/payment-authorization.entity.js";

export interface PaymentAuthorizationRepository {
  create(authorization: PaymentAuthorization): Promise<PaymentAuthorization>;

  update(authorization: PaymentAuthorization): Promise<PaymentAuthorization>;

  findById(id: string): Promise<PaymentAuthorization | null>;

  findByPaymentRequestIdAndUserId(
    paymentRequestId: string,
    userId: string,
  ): Promise<PaymentAuthorization | null>;

  claimAuthorized(
    id: string,
    userId: string,
  ): Promise<PaymentAuthorization | null>;
}
