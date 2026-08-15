import type { PaymentRequest } from "../entities/payment-request.entity.js";

export interface PaymentRequestRepository {
  create(request: PaymentRequest): Promise<PaymentRequest>;

  update(request: PaymentRequest): Promise<PaymentRequest>;

  findById(id: string): Promise<PaymentRequest | null>;
}
