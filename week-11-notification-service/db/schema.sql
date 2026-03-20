-- Week 11: Notification Service Schema

CREATE TABLE IF NOT EXISTS "Notifications" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Body" TEXT NOT NULL,
    "Type" INTEGER NOT NULL DEFAULT 0,
    "SentAt" TEXT,
    "IsRead" INTEGER NOT NULL DEFAULT 0
);

-- Type: 0=Email, 1=Webhook, 2=InApp

CREATE TABLE IF NOT EXISTS "Webhooks" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Url" TEXT NOT NULL,
    "Secret" TEXT NOT NULL,
    "IsActive" INTEGER NOT NULL DEFAULT 1,
    "Events" TEXT NOT NULL
);
