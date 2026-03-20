-- Week 10: API Gateway Seed Data

INSERT INTO ApiKeys (Key, Name, IsActive, RateLimit, CreatedAt) VALUES
('key-prod-alpha-001', 'Production App', 1, 1000, '2026-01-01T00:00:00'),
('key-dev-beta-002', 'Development Testing', 1, 200, '2026-01-05T08:00:00'),
('key-partner-003', 'Partner Integration', 1, 500, '2026-01-10T12:00:00'),
('key-mobile-004', 'Mobile App v2', 1, 300, '2026-01-15T09:00:00'),
('key-legacy-005', 'Legacy Client (deprecated)', 0, 50, '2025-06-01T00:00:00');

-- Request logs across multiple keys and endpoints
INSERT INTO RequestLogs (ApiKeyId, Endpoint, Method, StatusCode, Timestamp) VALUES
(1, '/api/orders', 'GET', 200, '2026-02-15T08:01:00'),
(1, '/api/orders', 'POST', 201, '2026-02-15T08:05:00'),
(1, '/api/orders/42', 'GET', 200, '2026-02-15T08:10:00'),
(1, '/api/users', 'GET', 200, '2026-02-15T08:15:00'),
(1, '/api/orders', 'GET', 200, '2026-02-15T09:00:00'),
(1, '/api/products', 'GET', 200, '2026-02-15T09:10:00'),
(2, '/api/orders', 'GET', 200, '2026-02-15T09:30:00'),
(2, '/api/orders/99', 'GET', 404, '2026-02-15T09:32:00'),
(2, '/api/auth/login', 'POST', 200, '2026-02-15T09:35:00'),
(2, '/api/auth/login', 'POST', 401, '2026-02-15T09:36:00'),
(3, '/api/products', 'GET', 200, '2026-02-15T10:00:00'),
(3, '/api/products', 'POST', 201, '2026-02-15T10:05:00'),
(3, '/api/products/7', 'PUT', 200, '2026-02-15T10:07:00'),
(3, '/api/products/99', 'DELETE', 404, '2026-02-15T10:09:00'),
(4, '/api/users/me', 'GET', 200, '2026-02-15T11:00:00'),
(4, '/api/notifications', 'GET', 200, '2026-02-15T11:05:00'),
(4, '/api/notifications', 'POST', 201, '2026-02-15T11:10:00'),
(1, '/api/orders', 'GET', 200, '2026-02-15T14:00:00'),
(1, '/api/orders', 'GET', 500, '2026-02-15T14:02:00'),
(1, '/api/orders', 'GET', 200, '2026-02-15T14:05:00'),
(5, '/api/legacy/sync', 'POST', 200, '2026-02-15T14:30:00'),
(5, '/api/legacy/sync', 'POST', 429, '2026-02-15T14:31:00'),
(2, '/api/dashboard', 'GET', 200, '2026-02-15T15:00:00'),
(2, '/api/dashboard', 'GET', 200, '2026-02-15T15:30:00'),
(3, '/api/webhooks', 'POST', 201, '2026-02-15T16:00:00');
