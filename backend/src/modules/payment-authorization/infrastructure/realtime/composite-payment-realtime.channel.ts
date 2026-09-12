import type { PaymentRealtimeChannel } from "../../application/ports/payment-realtime-channel.port.js";

export class CompositePaymentRealtimeChannel implements PaymentRealtimeChannel {
  constructor(private readonly channels: PaymentRealtimeChannel[]) {}

  async notifyAuthorizationRequired(params: {
    paymentRequestId: string;
    authorizationId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void> {
    await Promise.all(
      this.channels.map((channel) =>
        channel.notifyAuthorizationRequired(params),
      ),
    );
  }

  async notifyAuthorizationResult(params: {
    paymentRequestId: string;
    userId: string;
    authorized: boolean;
  }): Promise<void> {
    await Promise.all(
      this.channels.map((channel) => channel.notifyAuthorizationResult(params)),
    );
  }

  async notifyMerchantWaiting(params: {
    paymentRequestId: string;
    merchantUserId: string;
  }): Promise<void> {
    await Promise.all(
      this.channels.map((channel) => channel.notifyMerchantWaiting(params)),
    );
  }

  async notifyPaymentCompleted(params: {
    paymentRequestId: string;
    merchantUserId: string;
    customerUserId: string;
  }): Promise<void> {
    await Promise.all(
      this.channels.map((channel) => channel.notifyPaymentCompleted(params)),
    );
  }

  async notifyPaymentFailed(params: {
    paymentRequestId: string;
    merchantUserId: string;
    customerUserId: string;
    reason: string;
  }): Promise<void> {
    await Promise.all(
      this.channels.map((channel) => channel.notifyPaymentFailed(params)),
    );
  }
}
