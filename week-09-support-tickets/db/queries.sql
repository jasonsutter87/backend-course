-- Useful queries for Support Tickets
-- Practice running these against your database

-- Find all critical open tickets
SELECT * FROM Tickets
WHERE Priority = 3 AND Status = 0
ORDER BY CreatedAt ASC;

-- Count tickets by status
SELECT
    CASE Status WHEN 0 THEN 'Open' WHEN 1 THEN 'In Progress' WHEN 2 THEN 'Resolved' WHEN 3 THEN 'Closed' END AS Status,
    COUNT(*) AS Count
FROM Tickets GROUP BY Status;

-- Find overdue tickets (open for more than 7 days)
SELECT * FROM Tickets
WHERE Status IN (0, 1)
AND julianday('now') - julianday(CreatedAt) > 7
ORDER BY CreatedAt ASC;

-- Tickets created per day (last 30 days)
SELECT DATE(CreatedAt) AS Day, COUNT(*) AS Created
FROM Tickets
WHERE CreatedAt >= datetime('now', '-30 days')
GROUP BY DATE(CreatedAt)
ORDER BY Day;
