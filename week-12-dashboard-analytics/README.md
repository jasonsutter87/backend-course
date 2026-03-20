# Week 12 — Dashboard Analytics

## Objective
Build a configurable dashboard and analytics API that aggregates time-series data and exposes summary and trend endpoints. You'll learn how to build query-driven endpoints that filter and aggregate data server-side, and how to model flexible UI configuration as JSON-encoded strings stored in a relational database.

## Concepts Covered
- Aggregation and summary endpoints (count, grouping)
- Time-series filtering with date range query parameters
- Category-based data filtering using `IQueryable` composition
- Storing flexible widget configuration as a serialized JSON string
- Separating raw data storage (`DataPoint`) from presentation config (`DashboardWidget`)

## Project Overview
A dashboard analytics service that stores raw metric data points and a set of configurable dashboard widgets. The analytics endpoints let callers query summaries and trends filtered by category and date range. The dashboard API manages widget definitions that describe how data should be visualized on the frontend.

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
The SQLite database will be auto-created in the `db/` folder on first run.

### Start the Frontend
```bash
cd client
npm install
ng serve
```
Open **http://localhost:4200**

## API Endpoints

### Dashboard Widgets (`/api/dashboard`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | List all dashboard widgets |
| GET | `/api/dashboard/{id}` | Get a single widget by ID |
| POST | `/api/dashboard` | Create a new dashboard widget |
| PUT | `/api/dashboard/{id}` | Update widget title, type, data source, or config |
| DELETE | `/api/dashboard/{id}` | Delete a widget |

### Analytics (`/api/analytics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get a total count of all data points |
| GET | `/api/analytics/trend?category={cat}&from={date}&to={date}` | Get time-ordered data points, optionally filtered by category and/or date range |

## Data Model

### DashboardWidget

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `Title` | `string` | Display name shown on the dashboard |
| `Type` | `string` | Widget visualization type (e.g., `"bar"`, `"line"`, `"pie"`) |
| `DataSource` | `string` | Identifier or URL for the data this widget renders |
| `Config` | `string` | JSON-encoded configuration blob for widget-specific settings |

### DataPoint

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `Label` | `string` | Human-readable label for this measurement |
| `Value` | `double` | Numeric value of the measurement |
| `Category` | `string` | Grouping key used for filtering and trend analysis |
| `Timestamp` | `DateTime` | UTC timestamp when the measurement was recorded |

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
# Create a data point
curl -X POST http://localhost:5000/api/datapoints \
  -H "Content-Type: application/json" \
  -d '{"label":"Page Views","value":1420.0,"category":"web","timestamp":"2026-03-20T00:00:00Z"}'

# Get analytics summary
curl http://localhost:5000/api/analytics/summary

# Get trend data for a category
curl "http://localhost:5000/api/analytics/trend?category=web"

# Get trend data with a date range
curl "http://localhost:5000/api/analytics/trend?category=web&from=2026-03-01T00:00:00Z&to=2026-03-20T23:59:59Z"

# Create a dashboard widget
curl -X POST http://localhost:5000/api/dashboard \
  -H "Content-Type: application/json" \
  -d '{"title":"Daily Page Views","type":"line","dataSource":"web","config":"{\"color\":\"#4f46e5\",\"showLegend\":true}"}'

# List all widgets
curl http://localhost:5000/api/dashboard

# Update a widget
curl -X PUT http://localhost:5000/api/dashboard/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Weekly Page Views","type":"bar","dataSource":"web","config":"{\"color\":\"#16a34a\"}"}'

# Delete a widget
curl -X DELETE http://localhost:5000/api/dashboard/1
```

## Frontend Exercise
The Angular frontend has full HTML and CSS built out, but the **services are stubs**. Your task is to wire up the API connections.

Look for `// TODO:` comments in these service files:
- `client/src/app/services/dashboard.service.ts`
- `client/src/app/services/analytics.service.ts`

Replace `return of([])` with actual `this.http.get/post/put/delete()` calls to connect to the backend API.

## Key Takeaways
- `IQueryable` composition lets you build up filters incrementally before hitting the database — only one SQL query is executed regardless of how many `.Where()` calls you chain
- Storing widget `Config` as a JSON string trades strict typing for flexibility — useful when widget schemas vary by type and change frequently
- Separating raw data (`DataPoint`) from presentation config (`DashboardWidget`) keeps the data model clean and makes each concern independently evolvable
- Summary and trend endpoints reduce client-side computation and network payloads compared to fetching all raw data and aggregating in the browser
- Query parameters for date ranges should be validated server-side to return clear error messages when the format is invalid

## Challenges (Optional)
- Implement real aggregation in `AnalyticsController.GetSummary()` — return min, max, average, and sum grouped by category instead of just a total count
- Add a `POST /api/datapoints/batch` endpoint that accepts an array of data points and inserts them in a single database round-trip
- Add a `GET /api/analytics/trend?groupBy=day` parameter that buckets results by day/week/month instead of returning every individual data point
