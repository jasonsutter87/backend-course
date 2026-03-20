# Week 10 — API Gateway

## Objective
Build a lightweight API gateway that manages API keys, enforces rate limiting, and logs every inbound request. You'll learn how ASP.NET Core middleware pipelines work and how authentication and cross-cutting concerns can be applied globally before a request ever reaches a controller.

## Concepts Covered
- Custom ASP.NET Core middleware (`IMiddleware` / `RequestDelegate`)
- API key authentication via request headers
- Rate limiting middleware with per-key request counting
- Request logging to a relational store
- Managing access credentials (API keys) as first-class domain objects

## Project Overview
An API gateway service that sits in front of downstream resources. Clients must present a valid API key on every request. The gateway validates the key, checks the key's configured rate limit, proxies the request forward, and records the call in a request log. The admin API allows creating and toggling API keys without restarting the service.

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- Angular CLI

### Start the Backend
```bash
cd server
dotnet ef database update
dotnet run --urls="http://localhost:5000"
```

### Database

The schema is managed via EF Core Migrations. Reference SQL files live in the `db/` folder:

| File | Purpose |
|------|---------|
| `db/schema.sql` | Table definitions for `ApiKeys` and `RequestLogs` |
| `db/views.sql` | Reporting views: request volume per key, hourly traffic, top endpoints |
| `db/indexes.sql` | Performance indexes — run after schema creation |
| `db/seed.sql` | Sample API keys and 25 request log entries |
| `db/queries.sql` | Analytical queries: error rates, rate limit usage, traffic by hour |

#### Running the SQL files manually
```bash
sqlite3 db/app.db < db/schema.sql
sqlite3 db/app.db < db/indexes.sql
sqlite3 db/app.db < db/seed.sql
sqlite3 db/app.db < db/views.sql
```

#### Querying views
```bash
sqlite3 db/app.db "SELECT * FROM vw_RequestVolume;"
sqlite3 db/app.db "SELECT * FROM vw_TopEndpoints;"
sqlite3 db/app.db "SELECT * FROM vw_HourlyTraffic;"
```

### Start the Frontend
```bash
cd client
npm install
ng serve
```
Open **http://localhost:4200**

## API Endpoints

### API Key Management (`/api/apikeys`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apikeys` | List all API keys |
| GET | `/api/apikeys/{id}` | Get a single API key by ID |
| POST | `/api/apikeys` | Create a new API key |
| PUT | `/api/apikeys/{id}` | Update key name, active status, or rate limit |
| DELETE | `/api/apikeys/{id}` | Delete an API key |

### Gateway (`/api/gateway`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gateway/proxy?url={url}` | Forward a request to an upstream service URL |

## Data Model

### ApiKey

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `Key` | `string` | The secret key value presented by clients |
| `Name` | `string` | Human-readable label for the key |
| `IsActive` | `bool` | Whether this key is currently valid (default `true`) |
| `RateLimit` | `int` | Maximum requests allowed per time window |
| `CreatedAt` | `DateTime` | UTC timestamp set on creation |

### RequestLog

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `ApiKeyId` | `int` | Foreign key referencing the `ApiKey` used |
| `Endpoint` | `string` | The path that was requested |
| `Method` | `string` | HTTP method (GET, POST, etc.) |
| `StatusCode` | `int` | HTTP response status code returned |
| `Timestamp` | `DateTime` | UTC timestamp of the request |

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
# Create an API key
curl -X POST http://localhost:5000/api/apikeys \
  -H "Content-Type: application/json" \
  -d '{"key":"secret-abc-123","name":"Dev Key","isActive":true,"rateLimit":100}'

# List all API keys
curl http://localhost:5000/api/apikeys

# Get a single key
curl http://localhost:5000/api/apikeys/1

# Deactivate a key
curl -X PUT http://localhost:5000/api/apikeys/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Dev Key","isActive":false,"rateLimit":100}'

# Delete a key
curl -X DELETE http://localhost:5000/api/apikeys/1

# Proxy a request through the gateway
curl "http://localhost:5000/api/gateway/proxy?url=https://api.example.com/data"
```

## Frontend Exercise
The Angular frontend has full HTML and CSS built out, but the **services are stubs**. Your task is to wire up the API connections.

Look for `// TODO:` comments in these service files:
- `client/src/app/services/api-key.service.ts`
- `client/src/app/services/request-log.service.ts`

Replace `return of([])` with actual `this.http.get/post/put/delete()` calls to connect to the backend API.

## SQL Views and Indexes

**Views** let you encapsulate complex JOIN and aggregation logic once and reuse it like a table. The `vw_RequestVolume` view joins `ApiKeys` with `RequestLogs` and computes success/error counts — without a view you'd need to repeat that JOIN every time you query it.

**Indexes** are critical for request log tables because they grow fast. Without `IX_RequestLogs_Timestamp`, every time-range query scans the entire table. With it, SQLite jumps directly to the matching rows.

The `UNIQUE` index on `ApiKeys.Key` does double duty: it speeds up key lookups in the auth middleware and enforces uniqueness at the database level as a safety net beyond application-level validation.

## Key Takeaways
- Middleware runs before controllers, making it the right place for cross-cutting concerns like auth, logging, and rate limiting
- API keys stored in a database can be activated or deactivated at runtime without a redeployment
- Rate limiting should be enforced per key so high-volume clients cannot starve others
- Request logs are invaluable for debugging and billing — record them even when the upstream call fails
- The `proxy` endpoint stub shows the shape of a gateway pattern — in production this would use `HttpClient` to forward to real upstream services

## Challenges (Optional)
- Implement the proxy forwarding logic in `GatewayController` using `IHttpClientFactory` to actually forward requests to the target URL
- Add a `GET /api/requestlogs?apiKeyId={id}` endpoint so administrators can review the call history for a specific key
- Enhance the rate limiter to use a sliding-window algorithm instead of a fixed counter, resetting every 60 seconds
