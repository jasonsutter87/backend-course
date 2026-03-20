-- Week 9: Support Tickets Seed Data
-- 15 sample tickets with various statuses, priorities, and assignees

INSERT INTO Tickets (Title, Description, Status, Priority, AssignedTo, CreatedAt, UpdatedAt) VALUES
('Login page broken after deploy', 'Users cannot authenticate. Error 500 on POST /auth/login. Deployed v2.3 at 14:00 UTC.', 0, 3, 'alice@example.com', '2026-02-01T14:30:00', '2026-02-01T14:30:00'),
('Password reset email not sending', 'No reset emails received. SMTP logs show connection timeout to mailgun.', 1, 2, 'bob@example.com', '2026-02-03T09:00:00', '2026-02-03T11:00:00'),
('Dashboard loads slowly', 'Main dashboard takes 8-12 seconds to load. Seems related to the analytics widget.', 1, 1, 'alice@example.com', '2026-02-05T10:00:00', '2026-02-06T08:00:00'),
('CSV export missing columns', 'When exporting orders to CSV, the shipping address columns are blank.', 0, 1, NULL, '2026-02-07T15:00:00', '2026-02-07T15:00:00'),
('Mobile nav menu not closing', 'On iOS Safari, tapping outside the nav menu does not close it. Reproducible every time.', 2, 0, 'carol@example.com', '2026-02-08T08:30:00', '2026-02-10T14:00:00'),
('2FA codes rejected intermittently', 'Some users report valid TOTP codes being rejected. Rate is about 5% of logins.', 0, 3, NULL, '2026-02-09T11:00:00', '2026-02-09T11:00:00'),
('Order confirmation emails sending twice', 'Customers receive two confirmation emails per order. Started after the mailer refactor.', 1, 2, 'bob@example.com', '2026-02-10T13:00:00', '2026-02-10T15:30:00'),
('Profile picture upload fails over 2MB', 'Uploading a profile photo larger than 2MB returns 413. Limit should be 10MB per docs.', 2, 1, 'carol@example.com', '2026-02-11T09:00:00', '2026-02-13T10:00:00'),
('Search returns no results for special chars', 'Searching for names with apostrophes (e.g. O''Brien) returns empty results.', 3, 1, 'alice@example.com', '2026-01-20T10:00:00', '2026-02-01T09:00:00'),
('Invoice PDF layout broken in Firefox', 'Invoice PDFs render correctly in Chrome but columns overlap in Firefox.', 0, 0, NULL, '2026-02-14T16:00:00', '2026-02-14T16:00:00'),
('API rate limit returns wrong error code', 'When rate limited, the API returns 500 instead of 429. Clients cannot distinguish the error.', 0, 2, 'dave@example.com', '2026-02-15T11:30:00', '2026-02-15T11:30:00'),
('Bulk delete crashes on 500+ records', 'Selecting more than 500 records and deleting causes a timeout and 504 response.', 1, 3, 'dave@example.com', '2026-02-15T14:00:00', '2026-02-16T09:00:00'),
('Timezone offset wrong in date picker', 'Date picker shows UTC times instead of the user''s local timezone. Affects scheduling.', 3, 1, 'carol@example.com', '2026-01-25T08:00:00', '2026-02-05T10:00:00'),
('Webhook delivery silently failing', 'Webhook events are not firing for the payment.completed event. No error in logs.', 0, 2, 'alice@example.com', '2026-02-16T10:00:00', '2026-02-16T10:00:00'),
('Dark mode toggle resets on page refresh', 'Dark mode preference is not persisted. Reverts to light mode on every page load.', 2, 0, 'bob@example.com', '2026-02-12T14:00:00', '2026-02-14T11:00:00');
