# Week 6 — Inventory System

## Objective
Learn how to model one-to-many relationships and use them to track state changes over time. This week introduces the concept of append-only transaction logs, server-set timestamps, and how related data can be queried using EF Core navigation properties.

## Concepts Covered
- One-to-many relationships between a parent resource (`Product`) and child records (`Transaction`)
- Server-assigned timestamps using `DateTime.UtcNow` on record creation
- Append-only data patterns — transactions are created and deleted, never updated
- EF Core `Include` for loading a product alongside its transaction history
- Modeling stock levels as a derived value from a running transaction log

## Project Overview
An inventory management app where warehouse staff track products and record stock movements. Each product has a current stock level and a minimum threshold. When stock is received or shipped, a transaction is logged with a type of "In" or "Out" and the quantity moved. The API supports full CRUD for products and create/read/delete for transactions.

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

### Start the Frontend
```bash
cd client
npm install
ng serve
```
Open **http://localhost:4200**

## Database

This project uses **EF Core Migrations** to manage the database schema. The database is not created automatically — you must run migrations before starting the server for the first time.

### First-Time Setup
Install the EF Core CLI tools (one-time, global):
```bash
dotnet tool install --global dotnet-ef
```

Create and apply the initial migration from the `server/` directory:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Updating the Schema
Whenever you change a model (e.g., add a field to `Product`):
1. Edit the model class
2. `dotnet ef migrations add DescriptiveNameHere`
3. `dotnet ef database update`

### Useful Commands
| Command | What it does |
|---------|--------------|
| `dotnet ef migrations list` | Show all applied and pending migrations |
| `dotnet ef migrations remove` | Remove the last migration (only if not yet applied) |
| `dotnet ef database drop` | Delete the database file entirely |
| `dotnet ef migrations script` | Output the raw SQL for all migrations |

See `db/migrations-guide.md` for a full walkthrough, and `db/schema.sql` for the raw SQL that EF generates.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get a single product |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/{id}` | Update an existing product |
| DELETE | `/api/products/{id}` | Delete a product |
| GET | `/api/transactions` | Get all transactions with their associated product |
| GET | `/api/transactions/{id}` | Get a single transaction with its product |
| POST | `/api/transactions` | Record a new stock transaction (timestamp is set by server) |
| DELETE | `/api/transactions/{id}` | Delete a transaction record |

## Data Model

### Product

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `Name` | string | Product name |
| `SKU` | string | Stock Keeping Unit identifier |
| `StockLevel` | int | Current quantity in stock |
| `MinStockLevel` | int | Minimum stock threshold before reorder |
| `Transactions` | ICollection\<Transaction\> | Navigation property — stock movements |

### Transaction

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `ProductId` | int | Foreign key to Product |
| `Product` | Product | Navigation property — parent product |
| `Quantity` | int | Number of units moved |
| `Type` | string | Direction of movement: `"In"` or `"Out"` |
| `Timestamp` | DateTime | UTC time the transaction was recorded (set by server) |

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
# Get all products
curl http://localhost:5000/api/products

# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget A","sku":"WGT-001","stockLevel":100,"minStockLevel":20}'

# Record a stock-in transaction (timestamp set automatically by server)
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":50,"type":"In"}'

# Record a stock-out transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":10,"type":"Out"}'

# Get all transactions with product info
curl http://localhost:5000/api/transactions

# Delete a transaction
curl -X DELETE http://localhost:5000/api/transactions/1
```

## Key Takeaways
- One-to-many is the most common relationship in relational databases — a product owns many transactions
- Server-assigned timestamps prevent clients from spoofing or misreporting when events occurred
- Append-only logs are a reliable audit pattern: never edit or overwrite history, only add to it
- EF Core's `Include` in a query is the difference between getting a flat record and a fully hydrated object graph
- Separating the concept of "current state" (StockLevel on Product) from "change history" (Transactions) is a common and powerful design pattern

## Challenges (Optional)
- Add a `GET /api/products/{id}/transactions` endpoint that returns only the transaction history for one product
- Automatically update `Product.StockLevel` when a transaction is created (increment for "In", decrement for "Out")
- Add a `GET /api/products/low-stock` endpoint that returns only products where `StockLevel < MinStockLevel`
