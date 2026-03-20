-- Useful analytical queries for API Gateway
-- Practice running these against your database

-- Total requests per API key with error rate
SELECT
    ak.Name,
    COUNT(rl.Id) AS TotalRequests,
    SUM(CASE WHEN rl.StatusCode >= 400 THEN 1 ELSE 0 END) AS Errors,
    ROUND(100.0 * SUM(CASE WHEN rl.StatusCode >= 400 THEN 1 ELSE 0 END) / COUNT(rl.Id), 2) AS ErrorPct
FROM ApiKeys ak
LEFT JOIN RequestLogs rl ON ak.Id = rl.ApiKeyId
GROUP BY ak.Id
ORDER BY TotalRequests DESC;

-- Keys that have exceeded 80% of their rate limit in a single hour
SELECT
    ak.Name,
    ak.RateLimit,
    strftime('%Y-%m-%d %H:00', rl.Timestamp) AS Hour,
    COUNT(*) AS Requests
FROM ApiKeys ak
JOIN RequestLogs rl ON ak.Id = rl.ApiKeyId
GROUP BY ak.Id, Hour
HAVING Requests >= ak.RateLimit * 0.8
ORDER BY Requests DESC;

-- Endpoints returning the most errors
SELECT Endpoint, Method, COUNT(*) AS ErrorCount
FROM RequestLogs
WHERE StatusCode >= 400
GROUP BY Endpoint, Method
ORDER BY ErrorCount DESC
LIMIT 10;

-- Request volume by hour of day (traffic shape)
SELECT
    strftime('%H', Timestamp) AS Hour,
    COUNT(*) AS Requests
FROM RequestLogs
GROUP BY Hour
ORDER BY Hour;

-- Active vs inactive key summary
SELECT
    CASE IsActive WHEN 1 THEN 'Active' ELSE 'Inactive' END AS Status,
    COUNT(*) AS KeyCount,
    SUM(RateLimit) AS TotalCapacity
FROM ApiKeys
GROUP BY IsActive;
