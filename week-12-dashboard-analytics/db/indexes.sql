-- Strategic indexes for Dashboard Analytics
-- These indexes target the most common query patterns in analytics workloads

-- Speed up category filtering (the most common WHERE clause)
CREATE INDEX IF NOT EXISTS "IX_DataPoints_Category" ON "DataPoints" ("Category");

-- Speed up time-range filtering and ORDER BY Timestamp
CREATE INDEX IF NOT EXISTS "IX_DataPoints_Timestamp" ON "DataPoints" ("Timestamp");

-- Covering index: satisfies category + timestamp range queries without touching the table
-- Use when queries filter by Category and order/filter by Timestamp
CREATE INDEX IF NOT EXISTS "IX_DataPoints_Category_Timestamp" ON "DataPoints" ("Category", "Timestamp");

-- Covering index: satisfies aggregation queries (AVG, SUM, MIN, MAX by Category)
-- without reading the full row — the DB reads only this index
CREATE INDEX IF NOT EXISTS "IX_DataPoints_Category_Value" ON "DataPoints" ("Category", "Value");

-- Speed up widget lookups by data source (used when the frontend requests a specific feed)
CREATE INDEX IF NOT EXISTS "IX_DashboardWidgets_DataSource" ON "DashboardWidgets" ("DataSource");
