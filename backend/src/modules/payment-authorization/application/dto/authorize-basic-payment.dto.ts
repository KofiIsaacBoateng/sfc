import type {
  PaymentAuthorization,
  PaymentAuthorizationMethod,
  PaymentAuthorizationChannel,
  PaymentAuthorizationStatus,
} from "../../domain/entities/payment-authorization.entity.js";

export interface AuthorizeBasicPaymentDto {
  paymentRequestId: string;
  pin: string;
  channel: PaymentAuthorizationChannel;
}

export interface PaymentAuthorizationResponseDto {
  id: string;
  paymentRequestId: string;
  userId: string;
  method: PaymentAuthorizationMethod;
  channel: PaymentAuthorizationChannel;
  status: PaymentAuthorizationStatus;
  expiresAt: Date;
  authorizedAt: Date | null;
  consumedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const toPaymentAuthorizationResponse = (
  authorization: PaymentAuthorization,
): PaymentAuthorizationResponseDto => ({
  id: authorization.id,
  paymentRequestId: authorization.paymentRequestId,
  userId: authorization.userId,
  method: authorization.method,
  channel: authorization.channel,
  status: authorization.status,
  expiresAt: authorization.expiresAt,
  authorizedAt: authorization.authorizedAt,
  consumedAt: authorization.consumedAt,
  createdAt: authorization.createdAt,
  updatedAt: authorization.updatedAt,
});
