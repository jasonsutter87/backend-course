-- Week 12: Dashboard Analytics Schema

CREATE TABLE IF NOT EXISTS "DataPoints" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Label" TEXT NOT NULL,
    "Value" REAL NOT NULL,
    "Category" TEXT NOT NULL,
    "Timestamp" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "DashboardWidgets" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "DataSource" TEXT NOT NULL,
    "Config" TEXT NOT NULL DEFAULT '{}'
);
