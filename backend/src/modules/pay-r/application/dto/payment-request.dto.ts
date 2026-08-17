import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import type {
  PaymentRequest,
  PaymentRequestStatus,
} from "../../domain/entities/payment-request.entity.js";

/** request */
export interface CreatePaymentRequestDto {
  amount: string;
  currency: Currency;
  expiresAt: Date;
}

/** response */
export interface PaymentRequestResponseDto {
  id: string;
  requesterId: string;
  reference: string;
  amount: bigint;
  currency: Currency;
  status: PaymentRequestStatus;
  transactionId: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export const toPaymentRequestResponse = (
  request: PaymentRequest,
): PaymentRequestResponseDto => {
  return {
    id: request.id,
    requesterId: request.requesterId,
    reference: request.reference,
    amount: request.amount,
    currency: request.currency,
    status: request.status,
    transactionId: request.transactionId,
    expiresAt: request.expiresAt,
    createdAt: request.createdAt,
  };
};
