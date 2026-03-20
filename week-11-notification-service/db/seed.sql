-- Week 11: Notification Service Seed Data

INSERT INTO Webhooks (Url, Secret, IsActive, Events) VALUES
('https://hooks.example.com/deploy', 'secret-abc-111', 1, 'notification.created,notification.sent'),
('https://hooks.partner.io/alerts', 'secret-xyz-222', 1, 'notification.sent'),
('https://hooks.staging.internal/all', 'secret-dev-333', 0, 'notification.created,notification.sent,notification.read');

INSERT INTO Notifications (Title, Body, Type, SentAt, IsRead) VALUES
('Welcome to the platform', 'Thanks for signing up! Here is how to get started.', 2, '2026-02-01T09:00:00', 1),
('Deploy complete: v2.1', 'Version 2.1 has been deployed to production successfully.', 2, '2026-02-03T14:30:00', 1),
('Password changed', 'Your account password was changed. If this was not you, contact support.', 0, '2026-02-05T11:00:00', 1),
('New comment on your post', 'Alice commented: "Great writeup, very helpful!"', 2, '2026-02-07T16:20:00', 0),
('Subscription renewal reminder', 'Your subscription renews in 7 days on March 1st.', 0, '2026-02-22T08:00:00', 0),
('Webhook delivery failed', 'POST to https://hooks.partner.io/alerts returned 503. Will retry.', 1, '2026-02-10T10:15:00', 1),
('Database backup completed', 'Nightly backup finished successfully. Size: 2.3 GB.', 2, '2026-02-11T03:00:00', 1),
('Rate limit warning', 'API key key-prod-alpha-001 is at 85% of its hourly rate limit.', 2, '2026-02-12T14:00:00', 0),
('New user registered', 'dave@example.com joined the platform.', 2, '2026-02-13T09:45:00', 0),
('Security alert: login from new device', 'A login was detected from a new IP address: 203.0.113.42.', 0, '2026-02-14T22:10:00', 0),
('Report ready for download', 'Your monthly analytics report for January is ready.', 0, '2026-02-15T07:00:00', 0),
('Maintenance window scheduled', 'Planned maintenance on 2026-03-01 from 02:00–04:00 UTC.', 2, NULL, 0),
('Integration connected', 'Your Slack integration is now active.', 1, '2026-02-16T11:30:00', 1);
