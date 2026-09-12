import { getMessaging, type Messaging } from "firebase-admin/messaging";
import type {
  PushNotification,
  PushNotificationDto,
} from "../../application/ports/push-notification.port.js";

export class FirebasePushNotificationProvider implements PushNotification {
  constructor(private readonly messaging: Messaging = getMessaging()) {}

  async send(notification: PushNotificationDto): Promise<void> {
    await Promise.all(
      notification.tokens.map(async (token) =>
        this.messaging.send({
          token,

          notification: {
            title: notification.title,
            body: notification.body,
          },

          data: notification.data || {},
        }),
      ),
    );
  }
}
