# Week 4 — Expense Tracker

## Objective
Build an app that goes beyond CRUD by adding aggregation and reporting endpoints. This week you'll use LINQ `GroupBy`, `Sum`, and date-range filtering to produce summary data — the kind of server-side computation that keeps your frontend fast and your data consistent.

## Concepts Covered
- Query parameter filtering (`?categoryId=`, `?year=`, `?month=`)
- LINQ aggregation: `GroupBy`, `Sum`, `Count`
- Date-range filtering on a `DateTime` field
- Multiple controllers with distinct responsibilities (resources vs. reports)
- Many-to-one relationship: Expense belongs to Category
- Returning shaped/anonymous response objects from an endpoint

## Project Overview
A personal finance tracker where users log expenses and assign them to categories. The API supports filtering expenses by category, and a dedicated reports controller provides a monthly spending summary and a breakdown of totals by category.

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

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | Return all expenses (optionally filter by `?categoryId={id}`) |
| GET | /api/expenses/{id} | Return a single expense with its category |
| POST | /api/expenses | Create a new expense |
| PUT | /api/expenses/{id} | Update an existing expense |
| DELETE | /api/expenses/{id} | Delete an expense |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/monthly | Total and list of expenses for a given month (`?year=&month=`, defaults to current month) |
| GET | /api/reports/by-category | Total and count of expenses grouped by category |

## Data Model

### Category

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| Name | string | Category label (e.g., "Food", "Transport") |
| Expenses | ICollection\<Expense\> | Navigation property (all expenses in this category) |

### Expense

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| Amount | decimal | Monetary value of the expense |
| Description | string | What the expense was for |
| CategoryId | int | Foreign key to Category |
| Category | Category? | Navigation property (eager-loaded) |
| Date | DateTime | When the expense occurred |
| CreatedAt | DateTime | Record creation timestamp (UTC) |

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
# Create a category first
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Food"}'

# Create an expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount":12.50,"description":"Lunch","categoryId":1,"date":"2026-03-20T12:00:00Z"}'

# Get all expenses
curl http://localhost:5000/api/expenses

# Filter expenses by category
curl "http://localhost:5000/api/expenses?categoryId=1"

# Get a single expense
curl http://localhost:5000/api/expenses/1

# Update an expense
curl -X PUT http://localhost:5000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{"amount":15.00,"description":"Lunch and coffee","categoryId":1,"date":"2026-03-20T12:00:00Z"}'

# Delete an expense
curl -X DELETE http://localhost:5000/api/expenses/1

# Monthly report (defaults to current month)
curl http://localhost:5000/api/reports/monthly

# Monthly report for a specific month
curl "http://localhost:5000/api/reports/monthly?year=2026&month=3"

# Spending breakdown by category
curl http://localhost:5000/api/reports/by-category
```

## Key Takeaways
- Separating resource endpoints (`ExpensesController`) from computed/aggregate endpoints (`ReportsController`) keeps each controller's purpose clear
- LINQ `GroupBy` translates to a SQL `GROUP BY` — grouping and summing happens in the database, not in C# memory
- Optional query parameters with `int?` let a single endpoint serve both filtered and unfiltered requests gracefully
- `decimal` is the correct C# type for money — never use `float` or `double` for financial values
- Returning anonymous objects (`new { year, month, total, count, expenses }`) is fine for report-style endpoints where you're shaping data rather than persisting it

## Challenges (Optional)
- Add a `Categories` CRUD controller so categories can be managed through the API instead of being seeded manually
- Extend `GET /api/reports/monthly` to return a per-category breakdown within that month, not just a grand total
- Add a `GET /api/reports/annual?year=2026` endpoint that returns monthly totals for every month in the year
