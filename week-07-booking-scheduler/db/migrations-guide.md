# Week 7 — Migrations for Booking Scheduler

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
This generates a migration file in `Migrations/` that creates the `TimeSlots` and `Bookings` tables.

## Applying the Migration
```bash
dotnet ef database update
```
This creates the SQLite database in `../db/app.db` and also applies the seed data defined in `AppDbContext`.

## When You Change a Model
If you add a field to TimeSlot or Booking:
1. Make the change in the model class
2. Run: `dotnet ef migrations add DescriptiveNameHere`
3. Run: `dotnet ef database update`

## Useful Commands
- `dotnet ef migrations list` — see all migrations
- `dotnet ef migrations remove` — undo the last migration (if not applied)
- `dotnet ef database drop` — delete the database and start fresh
- `dotnet ef migrations script` — generate the raw SQL script

## Understanding Seed Data
This project uses EF Core's `HasData()` in `AppDbContext.OnModelCreating` to define seed time slots. Seed data is applied as part of a migration — when you run `dotnet ef database update`, EF generates INSERT statements for the seeded rows and applies them automatically.

If you change the seed data, create a new migration to capture the diff.
