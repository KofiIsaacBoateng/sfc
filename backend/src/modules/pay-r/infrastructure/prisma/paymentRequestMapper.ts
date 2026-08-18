import type { PaymentRequest as PrismaPaymentRequest } from "@/generated/client/client.js";
import {
  PaymentRequest,
  PaymentRequestStatus,
} from "../../domain/entities/payment-request.entity.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

export class PaymentRequestMapper {
  static toDomain(raw: PrismaPaymentRequest): PaymentRequest {
    return PaymentRequest.restore({
      ...raw,
      status: raw.status as PaymentRequestStatus,
      currency: raw.currency as Currency,
    });
  }

  static toPersistence(paymentRequest: PaymentRequest): PrismaPaymentRequest {
    return {
      id: paymentRequest.id,
      requesterId: paymentRequest.requesterId,
      amount: paymentRequest.amount,
      feeAmount: paymentRequest.feeAmount,
      totalAmount: paymentRequest.totalAmount,
      reference: paymentRequest.reference,
      transactionId: paymentRequest.transactionId,
      status: paymentRequest.status,
      currency: paymentRequest.currency,
      expiresAt: paymentRequest.expiresAt,
      createdAt: paymentRequest.createdAt,
      updatedAt: paymentRequest.updatedAt,
    };
  }
}
