export interface Webhook {
  id: number;
  url: string;
  secret: string;
  isActive: boolean;
  events: string;
}

export interface CreateWebhookDto {
  url: string;
  secret: string;
  events: string;
}
