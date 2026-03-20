export enum NotificationType {
  Email = 0,
  Webhook = 1,
  InApp = 2
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  sentAt: string | null;
  isRead: boolean;
}

export interface CreateNotificationDto {
  title: string;
  body: string;
  type: NotificationType;
}
