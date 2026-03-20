# Week 8 — Migrations for Employee Directory

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
This generates a migration file in `Migrations/` that creates the `Departments` and `Employees` tables, including the self-referencing foreign key on `Departments` and the performance indexes defined in `AppDbContext`.

## Applying the Migration
```bash
dotnet ef database update
```
This creates the SQLite database in `../db/app.db` and applies seed departments and employees automatically.

## When You Change a Model
1. Make the change in the model class or `AppDbContext`
2. Run: `dotnet ef migrations add DescriptiveNameHere`
3. Run: `dotnet ef database update`

## Useful Commands
- `dotnet ef migrations list` — see all migrations
- `dotnet ef migrations remove` — undo the last migration (if not applied)
- `dotnet ef database drop` — delete the database and start fresh
- `dotnet ef migrations script` — generate the raw SQL script

## Understanding Indexes
This project defines indexes in `AppDbContext.OnModelCreating` using the EF Core Fluent API. EF translates these into `CREATE INDEX` statements inside the migration. See `db/indexes.sql` for the raw SQL equivalents and an explanation of when each index is useful.
