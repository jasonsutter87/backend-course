# Week 11 — Notification Service

## Objective
Build a notification service that handles multiple delivery channels (email, webhook, in-app) and introduces background processing with a hosted worker service. You'll learn how to decouple message creation from message delivery using a queue and how to register webhooks for event-driven integrations.

## Concepts Covered
- Background services with `IHostedService` / `BackgroundService`
- Enum-based notification types (Email, Webhook, InApp)
- Webhook registration and event subscription management
- Deferred delivery with `SentAt` timestamps
- Read/unread state tracking on notifications

## Project Overview
A notification service API that allows applications to create notifications, track delivery, and register webhooks for event subscriptions. A background `NotificationWorker` processes the queue asynchronously. The webhook registry lets external systems subscribe to events and receive HTTP callbacks when notifications fire.

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- Angular CLI

### Start the Backend
```bash
cd server
dotnet run --urls="http://localhost:5000"
```

### Database

The schema is managed via EF Core Migrations. Reference SQL files live in the `db/` folder:

| File | Purpose |
|------|---------|
| `db/schema.sql` | Table definitions for `Notifications` and `Webhooks` |
| `db/stored-procedures.md` | Teaching guide: stored procedures vs raw SQL in SQLite |
| `db/indexes.sql` | Performance indexes for unread queries and type filtering |
| `db/seed.sql` | 13 sample notifications across all types, plus 3 webhooks |
| `db/queries.sql` | Practice queries: unread counts, pending delivery, read rates |

#### Running the SQL files manually
```bash
sqlite3 db/app.db < db/schema.sql
sqlite3 db/app.db < db/indexes.sql
sqlite3 db/app.db < db/seed.sql
```

### Start the Frontend
```bash
cd client
npm install
ng serve
```
Open **http://localhost:4200**

## API Endpoints

### Notifications (`/api/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List all notifications |
| GET | `/api/notifications/{id}` | Get a single notification by ID |
| POST | `/api/notifications` | Create a new notification |
| POST | `/api/notifications/mark-all-read` | Mark all unread notifications as read (raw SQL batch update) |
| PUT | `/api/notifications/{id}` | Update notification fields |
| DELETE | `/api/notifications/{id}` | Delete a notification |

### Webhooks (`/api/webhooks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks` | List all registered webhooks |
| GET | `/api/webhooks/{id}` | Get a single webhook by ID |
| POST | `/api/webhooks` | Register a new webhook |
| PUT | `/api/webhooks/{id}` | Update webhook URL, secret, status, or events |
| DELETE | `/api/webhooks/{id}` | Unregister a webhook |

## Data Model

### Notification

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `Title` | `string` | Short subject line of the notification |
| `Body` | `string` | Full notification message content |
| `Type` | `NotificationType` | Delivery channel (see enum below) |
| `SentAt` | `DateTime?` | UTC timestamp when delivery occurred (null if pending) |
| `IsRead` | `bool` | Whether the recipient has read the notification (default `false`) |

### NotificationType (enum)

| Value | Description |
|-------|-------------|
| `Email` | Delivered via email |
| `Webhook` | Delivered via HTTP callback to a registered URL |
| `InApp` | Displayed in the application UI |

### Webhook

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `Url` | `string` | Target URL that receives HTTP POST callbacks |
| `Secret` | `string` | Shared secret for HMAC signature verification |
| `IsActive` | `bool` | Whether this webhook is currently enabled (default `true`) |
| `Events` | `string` | Comma-separated list of event names this webhook subscribes to |

## Running Tests

### Backend Tests
```bash
cd server
dotnet test
```

### Frontend Tests
```bash
cd client
ng test
```

### Manual API Testing
```bash
# Create a notification
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy complete","body":"Version 2.1 deployed to production","type":2,"isRead":false}'

# List all notifications
curl http://localhost:5000/api/notifications

# Mark a notification as read
curl -X PUT http://localhost:5000/api/notifications/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy complete","body":"Version 2.1 deployed to production","type":2,"isRead":true}'

# Register a webhook
curl -X POST http://localhost:5000/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{"url":"https://myapp.example.com/hooks/notify","secret":"mysecret","isActive":true,"events":"notification.created,notification.sent"}'

# List all webhooks
curl http://localhost:5000/api/webhooks

# Deactivate a webhook
curl -X PUT http://localhost:5000/api/webhooks/1 \
  -H "Content-Type: application/json" \
  -d '{"url":"https://myapp.example.com/hooks/notify","secret":"mysecret","isActive":false,"events":"notification.created"}'

# Delete a notification
curl -X DELETE http://localhost:5000/api/notifications/1
```

## Frontend Exercise
The Angular frontend has full HTML and CSS built out, but the **services are stubs**. Your task is to wire up the API connections.

Look for `// TODO:` comments in these service files:
- `client/src/app/services/notification.service.ts`
- `client/src/app/services/webhook.service.ts`

Replace `return of([])` with actual `this.http.get/post/put/delete()` calls to connect to the backend API.

## Stored Procedures vs Raw SQL

SQLite does not support stored procedures, but the concept translates directly. A stored procedure is pre-compiled SQL stored in the database itself — useful for batch operations, complex business logic shared across apps, and security boundaries.

The `mark-all-read` endpoint demonstrates the SQLite equivalent using EF Core's `ExecuteSqlRawAsync`:

```csharp
var count = await _db.Database.ExecuteSqlRawAsync(
    "UPDATE Notifications SET IsRead = 1 WHERE IsRead = 0");
```

This runs a single SQL statement that updates all matching rows in one database round-trip, which is far more efficient than fetching each record and saving them individually. See `db/stored-procedures.md` for a full comparison with SQL Server stored procedure syntax.

## Key Takeaways
- Background services (`BackgroundService`) run outside the request pipeline and are ideal for async delivery tasks like sending emails or firing webhook callbacks
- `SentAt` being nullable cleanly separates "pending" from "delivered" without a separate status field
- Webhooks require a shared secret so receivers can verify the payload was not tampered with in transit (HMAC-SHA256 signature over the body)
- Storing subscribed `Events` as a string is a pragmatic approach for simple systems; a join table is better when event lists grow large
- Decoupling notification creation from delivery improves reliability — a failed delivery doesn't fail the original request

## Challenges (Optional)
- Implement the `NotificationWorker` to actually send webhook callbacks using `IHttpClientFactory`, including HMAC-SHA256 signature headers
- Add a `GET /api/notifications?isRead=false` filter endpoint so clients can fetch only unread notifications
- Add retry logic to the worker so failed webhook deliveries are retried up to three times with exponential backoff
