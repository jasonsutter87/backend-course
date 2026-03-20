-- Performance indexes for API Gateway
CREATE INDEX IF NOT EXISTS "IX_RequestLogs_ApiKeyId" ON "RequestLogs" ("ApiKeyId");
CREATE INDEX IF NOT EXISTS "IX_RequestLogs_Timestamp" ON "RequestLogs" ("Timestamp");
CREATE INDEX IF NOT EXISTS "IX_RequestLogs_Endpoint" ON "RequestLogs" ("Endpoint");
CREATE UNIQUE INDEX IF NOT EXISTS "IX_ApiKeys_Key" ON "ApiKeys" ("Key");
