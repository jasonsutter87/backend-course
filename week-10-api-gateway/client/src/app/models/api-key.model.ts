export interface ApiKey {
  id: number;
  key: string;
  name: string;
  isActive: boolean;
  rateLimit: number;
  createdAt: string;
}

export interface CreateApiKeyDto {
  name: string;
  rateLimit: number;
}
