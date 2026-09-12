export interface PushNotificationDto {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushNotification {
  send(notification: PushNotificationDto): Promise<void>;
}
