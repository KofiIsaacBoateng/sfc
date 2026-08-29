import {
  PaymentAuthorization,
  PaymentAuthorizationChannel,
  PaymentAuthorizationMethod,
  PaymentAuthorizationStatus,
} from "../../domain/entities/payment-authorization.entity.js";
import type { PaymentAuthorization as PrismaPaymentAuthorization } from "@/generated/client/client.js";
export class PaymentAuthorizationMapper {
  static toDomain(raw: PrismaPaymentAuthorization): PaymentAuthorization {
    return PaymentAuthorization.restore({
      ...raw,
      channel: raw.channel as PaymentAuthorizationChannel,
      method: raw.method as PaymentAuthorizationMethod,
      status: raw.status as PaymentAuthorizationStatus,
    });
  }

  static toPersistence(
    paymentAuthorization: PaymentAuthorization,
  ): PrismaPaymentAuthorization {
    return {
      id: paymentAuthorization.id,
      paymentRequestId: paymentAuthorization.paymentRequestId,
      userId: paymentAuthorization.userId,
      method: paymentAuthorization.method,
      channel: paymentAuthorization.channel,
      status: paymentAuthorization.status,
      expiresAt: paymentAuthorization.expiresAt,
      authorizedAt: paymentAuthorization.authorizedAt,
      consumedAt: paymentAuthorization.consumedAt,
      createdAt: paymentAuthorization.createdAt,
      updatedAt: paymentAuthorization.updatedAt,
    };
  }
}
