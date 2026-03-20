-- Week 12: Dashboard Analytics Seed Data
-- 56 data points across 4 categories (revenue, users, orders, pageviews)
-- spanning September 2025 through February 2026

INSERT INTO DashboardWidgets (Title, Type, DataSource, Config) VALUES
('Monthly Revenue', 'bar', 'revenue', '{"color":"#4f46e5","showLegend":true,"prefix":"$"}'),
('New Users Over Time', 'line', 'users', '{"color":"#16a34a","showLegend":true}'),
('Orders per Month', 'bar', 'orders', '{"color":"#ea580c","showLegend":false}'),
('Page Views Trend', 'line', 'pageviews', '{"color":"#0891b2","showLegend":true}'),
('Category Breakdown', 'pie', 'revenue', '{"showLabels":true}');

-- Revenue (monthly totals in USD)
INSERT INTO DataPoints (Label, Value, Category, Timestamp) VALUES
('Sep Revenue', 41200.00, 'revenue', '2025-09-30T23:59:59'),
('Oct Revenue', 47800.00, 'revenue', '2025-10-31T23:59:59'),
('Nov Revenue', 53400.00, 'revenue', '2025-11-30T23:59:59'),
('Dec Revenue', 68900.00, 'revenue', '2025-12-31T23:59:59'),
('Jan Revenue', 44100.00, 'revenue', '2026-01-31T23:59:59'),
('Feb Revenue', 51600.00, 'revenue', '2026-02-28T23:59:59'),
-- Weekly breakdown for February
('Feb W1 Revenue', 11200.00, 'revenue', '2026-02-07T23:59:59'),
('Feb W2 Revenue', 13400.00, 'revenue', '2026-02-14T23:59:59'),
('Feb W3 Revenue', 14600.00, 'revenue', '2026-02-21T23:59:59'),
('Feb W4 Revenue', 12400.00, 'revenue', '2026-02-28T23:59:59'),
-- Daily for the last week of February
('Feb 24 Revenue', 3100.00, 'revenue', '2026-02-24T23:59:59'),
('Feb 25 Revenue', 2900.00, 'revenue', '2026-02-25T23:59:59'),
('Feb 26 Revenue', 3400.00, 'revenue', '2026-02-26T23:59:59'),
('Feb 27 Revenue', 1800.00, 'revenue', '2026-02-27T23:59:59'),
('Feb 28 Revenue', 1200.00, 'revenue', '2026-02-28T23:59:59');

-- New users (monthly signups)
INSERT INTO DataPoints (Label, Value, Category, Timestamp) VALUES
('Sep New Users', 312, 'users', '2025-09-30T23:59:59'),
('Oct New Users', 398, 'users', '2025-10-31T23:59:59'),
('Nov New Users', 445, 'users', '2025-11-30T23:59:59'),
('Dec New Users', 502, 'users', '2025-12-31T23:59:59'),
('Jan New Users', 389, 'users', '2026-01-31T23:59:59'),
('Feb New Users', 421, 'users', '2026-02-28T23:59:59'),
-- Weekly breakdown for February
('Feb W1 Users', 88, 'users', '2026-02-07T23:59:59'),
('Feb W2 Users', 112, 'users', '2026-02-14T23:59:59'),
('Feb W3 Users', 121, 'users', '2026-02-21T23:59:59'),
('Feb W4 Users', 100, 'users', '2026-02-28T23:59:59'),
-- Daily for the last week of February
('Feb 24 Users', 22, 'users', '2026-02-24T23:59:59'),
('Feb 25 Users', 18, 'users', '2026-02-25T23:59:59'),
('Feb 26 Users', 31, 'users', '2026-02-26T23:59:59'),
('Feb 27 Users', 14, 'users', '2026-02-27T23:59:59'),
('Feb 28 Users', 15, 'users', '2026-02-28T23:59:59');

-- Orders (monthly order counts)
INSERT INTO DataPoints (Label, Value, Category, Timestamp) VALUES
('Sep Orders', 1840, 'orders', '2025-09-30T23:59:59'),
('Oct Orders', 2210, 'orders', '2025-10-31T23:59:59'),
('Nov Orders', 2580, 'orders', '2025-11-30T23:59:59'),
('Dec Orders', 3120, 'orders', '2025-12-31T23:59:59'),
('Jan Orders', 1990, 'orders', '2026-01-31T23:59:59'),
('Feb Orders', 2340, 'orders', '2026-02-28T23:59:59'),
-- Weekly breakdown for February
('Feb W1 Orders', 510, 'orders', '2026-02-07T23:59:59'),
('Feb W2 Orders', 620, 'orders', '2026-02-14T23:59:59'),
('Feb W3 Orders', 680, 'orders', '2026-02-21T23:59:59'),
('Feb W4 Orders', 530, 'orders', '2026-02-28T23:59:59'),
-- Daily for the last week of February
('Feb 24 Orders', 142, 'orders', '2026-02-24T23:59:59'),
('Feb 25 Orders', 118, 'orders', '2026-02-25T23:59:59'),
('Feb 26 Orders', 156, 'orders', '2026-02-26T23:59:59'),
('Feb 27 Orders', 74, 'orders', '2026-02-27T23:59:59'),
('Feb 28 Orders', 40, 'orders', '2026-02-28T23:59:59');

-- Page views (monthly totals)
INSERT INTO DataPoints (Label, Value, Category, Timestamp) VALUES
('Sep Page Views', 184200, 'pageviews', '2025-09-30T23:59:59'),
('Oct Page Views', 201400, 'pageviews', '2025-10-31T23:59:59'),
('Nov Page Views', 219800, 'pageviews', '2025-11-30T23:59:59'),
('Dec Page Views', 248600, 'pageviews', '2025-12-31T23:59:59'),
('Jan Page Views', 196400, 'pageviews', '2026-01-31T23:59:59'),
('Feb Page Views', 214200, 'pageviews', '2026-02-28T23:59:59'),
-- Weekly breakdown for February
('Feb W1 Page Views', 46800, 'pageviews', '2026-02-07T23:59:59'),
('Feb W2 Page Views', 56200, 'pageviews', '2026-02-14T23:59:59'),
('Feb W3 Page Views', 62400, 'pageviews', '2026-02-21T23:59:59'),
('Feb W4 Page Views', 48800, 'pageviews', '2026-02-28T23:59:59'),
-- Daily for the last week of February
('Feb 24 Page Views', 13200, 'pageviews', '2026-02-24T23:59:59'),
('Feb 25 Page Views', 11400, 'pageviews', '2026-02-25T23:59:59'),
('Feb 26 Page Views', 14600, 'pageviews', '2026-02-26T23:59:59'),
('Feb 27 Page Views', 5800, 'pageviews', '2026-02-27T23:59:59'),
('Feb 28 Page Views', 3800, 'pageviews', '2026-02-28T23:59:59');
