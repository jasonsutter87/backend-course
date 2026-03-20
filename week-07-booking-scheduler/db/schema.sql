-- Week 7: Booking Scheduler Schema
-- This is what EF Core Migrations generates under the hood

CREATE TABLE IF NOT EXISTS "TimeSlots" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "StartTime" TEXT NOT NULL,
    "EndTime" TEXT NOT NULL,
    "IsAvailable" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "Bookings" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "TimeSlotId" INTEGER NOT NULL UNIQUE,
    "CustomerName" TEXT NOT NULL,
    "CustomerEmail" TEXT NOT NULL,
    "BookedAt" TEXT NOT NULL,
    FOREIGN KEY ("TimeSlotId") REFERENCES "TimeSlots" ("Id") ON DELETE CASCADE
);
