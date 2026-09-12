import type { PaymentRealtimeChannel } from "../../application/ports/payment-realtime-channel.port.js";
import type { PushNotification } from "@/modules/notifications/application/ports/push-notification.port.js";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

export class FirebasePaymentRealtimeChannel implements PaymentRealtimeChannel {
  constructor(
    private readonly pushNotification: PushNotification,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async notifyAuthorizationRequired(params: {
    paymentRequestId: string;
    authorizationId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void> {
    const pushDevices = await this.unitOfWork.execute(async (repos) => {
      return repos.pushDevice.findByUserId(params.userId);
    });

    if (pushDevices.length === 0) {
      return;
    }

    await this.pushNotification.send({
      tokens: pushDevices.map((device) => device.token),

      title: "Payment authorization required",
      body: "A payment is waiting for your authorization.",

      data: {
        type: "PAYMENT_AUTHORIZATION_REQUIRED",
        paymentRequestId: params.paymentRequestId,
        authorizationId: params.authorizationId,
        expiresAt: params.expiresAt.toISOString(),
      },
    });
  }

  async notifyAuthorizationResult(): Promise<void> {
    // Socket.IO handles this realtime event.
  }

  async notifyMerchantWaiting(): Promise<void> {
    // Socket.IO handles this realtime event.
  }

  async notifyPaymentCompleted(): Promise<void> {
    // Socket.IO handles this realtime event.
  }

  async notifyPaymentFailed(): Promise<void> {
    // Socket.IO handles this realtime event.
  }
}
