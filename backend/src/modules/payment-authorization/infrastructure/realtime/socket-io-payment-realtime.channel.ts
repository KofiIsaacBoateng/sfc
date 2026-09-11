import type { Server } from "socket.io";
import type { PaymentRealtimeChannel } from "../../application/ports/payment-realtime-channel.port.js";

export class SocketIoPaymentRealtimeChannel implements PaymentRealtimeChannel {
  constructor(private readonly io: Server) {}

  async notifyAuthorizationRequired(params: {
    paymentRequestId: string;
    authorizationId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void> {
    this.io.to(`user:${params.userId}`).emit("payment:authorization-required", {
      paymentRequestId: params.paymentRequestId,
      authorizationId: params.authorizationId,
      expiresAt: params.expiresAt.toISOString(),
    });
  }

  async notifyAuthorizationResult(params: {
    paymentRequestId: string;
    userId: string;
    authorized: boolean;
  }): Promise<void> {
    this.io.to(`user:${params.userId}`).emit("payment:authorization-results", {
      paymentRequestId: params.paymentRequestId,
      authorized: params.authorized,
    });
  }

  async notifyMerchantWaiting(params: {
    paymentRequestId: string;
    merchantUserId: string;
  }): Promise<void> {
    this.io
      .to(`user:${params.merchantUserId}`)
      .emit("payment:merchant-waiting", {
        paymentRequestId: params.paymentRequestId,
      });
  }

  async notifyPaymentCompleted(params: {
    paymentRequestId: string;
    merchantUserId: string;
    customerUserId: string;
  }): Promise<void> {
    this.io.to(`user:${params.merchantUserId}`).emit("payment:completed", {
      paymentRequestId: params.paymentRequestId,
    });

    this.io.to(`user:${params.customerUserId}`).emit("payment:completed", {
      paymentRequestId: params.paymentRequestId,
    });
  }

  async notifyPaymentFailed(params: {
    paymentRequestId: string;
    merchantUserId: string;
    customerUserId: string;
    reason: string;
  }): Promise<void> {
    this.io.to(`user:${params.merchantUserId}`).emit("payment:failed", {
      paymentRequestId: params.paymentRequestId,
      reason: params.reason,
    });

    this.io.to(`user:${params.customerUserId}`).emit("payment:failed", {
      paymentRequestId: params.paymentRequestId,
      reason: params.reason,
    });
  }
}
