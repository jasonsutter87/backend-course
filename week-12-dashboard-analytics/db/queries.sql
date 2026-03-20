-- Analytical queries for Dashboard Analytics
-- Practice EXPLAIN QUERY PLAN on these to see index usage

-- Month-over-month trend for a single category
SELECT
    substr(Timestamp, 1, 7) AS Month,
    SUM(Value) AS Total
FROM DataPoints
WHERE Category = 'revenue'
  AND length(Label) > 10  -- filter to monthly labels only
GROUP BY Month
ORDER BY Month;

-- Category summary: min, max, average, total
SELECT
    Category,
    COUNT(*) AS DataPointCount,
    ROUND(MIN(Value), 2) AS MinValue,
    ROUND(MAX(Value), 2) AS MaxValue,
    ROUND(AVG(Value), 2) AS AvgValue,
    ROUND(SUM(Value), 2) AS TotalValue
FROM DataPoints
GROUP BY Category
ORDER BY TotalValue DESC;

-- Date range query: all data points in Q4 2025
SELECT Label, Value, Category, Timestamp
FROM DataPoints
WHERE Timestamp >= '2025-10-01'
  AND Timestamp < '2026-01-01'
ORDER BY Category, Timestamp;

-- Use EXPLAIN QUERY PLAN to see if an index is used
EXPLAIN QUERY PLAN
SELECT * FROM DataPoints WHERE Category = 'orders' ORDER BY Timestamp DESC;

-- Pagination: page 2 of results (20 per page)
SELECT Label, Value, Category, Timestamp
FROM DataPoints
ORDER BY Timestamp DESC
LIMIT 20 OFFSET 20;

-- Running total (window function equivalent using a self-join)
-- Simulates cumulative revenue over time
SELECT
    a.Label,
    a.Value AS MonthlyRevenue,
    SUM(b.Value) AS CumulativeRevenue
FROM DataPoints a
JOIN DataPoints b
  ON b.Category = 'revenue'
  AND b.Timestamp <= a.Timestamp
  AND length(b.Label) > 10
WHERE a.Category = 'revenue'
  AND length(a.Label) > 10
GROUP BY a.Id
ORDER BY a.Timestamp;

-- Top category by latest month value
SELECT Category, Value AS LatestMonthlyValue
FROM DataPoints
WHERE Timestamp = (
    SELECT MAX(Timestamp) FROM DataPoints dp2
    WHERE dp2.Category = DataPoints.Category
)
  AND length(Label) > 10
ORDER BY Value DESC;
