export interface RequestLog {
  id: number;
  apiKeyId: number;
  endpoint: string;
  method: string;
  statusCode: number;
  timestamp: string;
}
