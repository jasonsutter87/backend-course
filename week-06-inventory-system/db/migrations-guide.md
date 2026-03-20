# Week 6 — Migrations for Inventory System

## Setup
Install the EF Core tools (one-time):
```bash
dotnet tool install --global dotnet-ef
```

## Creating Your First Migration
From the `server/` directory:
```bash
dotnet ef migrations add InitialCreate
```
This generates a migration file in `Migrations/` that contains the SQL to create the `Products` and `Transactions` tables.

## Applying the Migration
```bash
dotnet ef database update
```
This creates the SQLite database in `../db/app.db`.

## When You Change a Model
If you add a field to Product or Transaction:
1. Make the change in the model class
2. Run: `dotnet ef migrations add DescriptiveNameHere`
3. Run: `dotnet ef database update`

## Useful Commands
- `dotnet ef migrations list` — see all migrations
- `dotnet ef migrations remove` — undo the last migration (if not applied)
- `dotnet ef database drop` — delete the database and start fresh
- `dotnet ef migrations script` — generate the raw SQL script

## Understanding the Migration File
Open the generated file in `Migrations/`. You'll see:
- `Up()` — what runs when you apply the migration
- `Down()` — what runs when you rollback
- The `ModelSnapshot` — EF's understanding of your current schema
