-- API Gateway Views

-- Request volume per API key
CREATE VIEW IF NOT EXISTS vw_RequestVolume AS
SELECT
    ak.Name AS KeyName,
    ak.Key,
    COUNT(rl.Id) AS TotalRequests,
    SUM(CASE WHEN rl.StatusCode >= 200 AND rl.StatusCode < 300 THEN 1 ELSE 0 END) AS SuccessCount,
    SUM(CASE WHEN rl.StatusCode >= 400 THEN 1 ELSE 0 END) AS ErrorCount
FROM ApiKeys ak
LEFT JOIN RequestLogs rl ON ak.Id = rl.ApiKeyId
GROUP BY ak.Id;

-- Hourly traffic pattern
CREATE VIEW IF NOT EXISTS vw_HourlyTraffic AS
SELECT
    strftime('%H', Timestamp) AS Hour,
    COUNT(*) AS RequestCount,
    AVG(StatusCode) AS AvgStatusCode
FROM RequestLogs
GROUP BY strftime('%H', Timestamp)
ORDER BY Hour;

-- Most hit endpoints
CREATE VIEW IF NOT EXISTS vw_TopEndpoints AS
SELECT
    Endpoint,
    Method,
    COUNT(*) AS HitCount,
    SUM(CASE WHEN StatusCode >= 400 THEN 1 ELSE 0 END) AS ErrorCount
FROM RequestLogs
GROUP BY Endpoint, Method
ORDER BY HitCount DESC;
