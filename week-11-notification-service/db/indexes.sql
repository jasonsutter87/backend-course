-- Performance indexes for Notification Service
CREATE INDEX IF NOT EXISTS "IX_Notifications_IsRead" ON "Notifications" ("IsRead");
CREATE INDEX IF NOT EXISTS "IX_Notifications_Type" ON "Notifications" ("Type");
CREATE INDEX IF NOT EXISTS "IX_Notifications_SentAt" ON "Notifications" ("SentAt");
CREATE INDEX IF NOT EXISTS "IX_Webhooks_IsActive" ON "Webhooks" ("IsActive");
