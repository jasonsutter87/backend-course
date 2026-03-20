-- Week 6: Inventory System Schema
-- This is what EF Core Migrations generates under the hood

CREATE TABLE IF NOT EXISTS "Products" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "StockLevel" INTEGER NOT NULL,
    "MinStockLevel" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "Transactions" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProductId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Type" TEXT NOT NULL,
    "Timestamp" TEXT NOT NULL,
    FOREIGN KEY ("ProductId") REFERENCES "Products" ("Id") ON DELETE CASCADE
);
