-- Useful queries for Notification Service
-- Practice running these against your database

-- Count unread notifications by type
SELECT
    CASE Type WHEN 0 THEN 'Email' WHEN 1 THEN 'Webhook' WHEN 2 THEN 'InApp' END AS Type,
    COUNT(*) AS UnreadCount
FROM Notifications
WHERE IsRead = 0
GROUP BY Type;

-- Notifications pending delivery (no SentAt timestamp)
SELECT * FROM Notifications
WHERE SentAt IS NULL
ORDER BY Id ASC;

-- Notifications sent in the last 7 days
SELECT * FROM Notifications
WHERE SentAt >= datetime('now', '-7 days')
ORDER BY SentAt DESC;

-- Active webhooks and the events they subscribe to
SELECT Id, Url, Events FROM Webhooks
WHERE IsActive = 1
ORDER BY Id;

-- Read rate by notification type
SELECT
    CASE Type WHEN 0 THEN 'Email' WHEN 1 THEN 'Webhook' WHEN 2 THEN 'InApp' END AS Type,
    COUNT(*) AS Total,
    SUM(IsRead) AS ReadCount,
    ROUND(100.0 * SUM(IsRead) / COUNT(*), 1) AS ReadPct
FROM Notifications
GROUP BY Type;
