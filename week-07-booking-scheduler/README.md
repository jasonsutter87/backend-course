# Week 7 — Booking Scheduler

## Objective
Learn how to enforce business rules at the API layer and manage state transitions on related records. This week introduces conflict detection, conditional creation logic, and the pattern of keeping two related records in sync when one is modified.

## Concepts Covered
- Business rule enforcement in controller actions (availability checks before booking)
- State transitions — marking a `TimeSlot` unavailable when booked, and restoring it on cancellation
- HTTP conflict responses (`409 Conflict`) for constraint violations
- One-to-one relationships between `TimeSlot` and `Booking`
- Server-assigned `BookedAt` timestamps to track when a reservation was made

## Project Overview
An appointment scheduling app where admins define available time slots and customers can book them. A slot can only be booked once — attempting to book an already-taken slot returns a 409. Cancelling a booking restores the slot to available so it can be booked again. The API supports full CRUD for time slots and create/read/delete for bookings.

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots` | Get all time slots |
| GET | `/api/slots/{id}` | Get a single time slot |
| POST | `/api/slots` | Create a new time slot |
| PUT | `/api/slots/{id}` | Update a time slot |
| DELETE | `/api/slots/{id}` | Delete a time slot |
| GET | `/api/bookings` | Get all bookings with their associated time slot |
| GET | `/api/bookings/{id}` | Get a single booking with its time slot |
| POST | `/api/bookings` | Create a booking (returns 409 if slot is unavailable) |
| DELETE | `/api/bookings/{id}` | Cancel a booking and restore slot availability |

## Data Model

### TimeSlot

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `StartTime` | DateTime | Start of the available window |
| `EndTime` | DateTime | End of the available window |
| `IsAvailable` | bool | Whether the slot can still be booked (default: `true`) |
| `Booking` | Booking? | Navigation property — the booking that claimed this slot (nullable) |

### Booking

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `TimeSlotId` | int | Foreign key to the reserved TimeSlot |
| `TimeSlot` | TimeSlot | Navigation property — the associated time slot |
| `CustomerName` | string | Full name of the customer |
| `CustomerEmail` | string | Email address of the customer |
| `BookedAt` | DateTime | UTC timestamp when the booking was created (set by server) |

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
# Create a time slot
curl -X POST http://localhost:5000/api/slots \
  -H "Content-Type: application/json" \
  -d '{"startTime":"2026-04-01T09:00:00Z","endTime":"2026-04-01T10:00:00Z","isAvailable":true}'

# Get all slots
curl http://localhost:5000/api/slots

# Book a slot (BookedAt is set by the server)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"timeSlotId":1,"customerName":"Jane Smith","customerEmail":"jane@example.com"}'

# Attempt to double-book the same slot — expect 409 Conflict
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"timeSlotId":1,"customerName":"John Doe","customerEmail":"john@example.com"}'

# Get all bookings with slot info
curl http://localhost:5000/api/bookings

# Cancel a booking (restores slot availability)
curl -X DELETE http://localhost:5000/api/bookings/1
```

## Key Takeaways
- Controllers are the right place to enforce business rules that span multiple records
- Returning `409 Conflict` is more semantically correct than `400 Bad Request` when a constraint collision occurs
- State transitions (available -> booked -> available) must be kept consistent — both sides of a relationship need updating atomically
- EF Core's `SaveChangesAsync` wraps all pending changes in a single transaction, which is key to keeping related records in sync
- A one-to-one relationship is modeled by having the dependent entity (`Booking`) hold a foreign key to the principal (`TimeSlot`)

## Challenges (Optional)
- Add a `GET /api/slots/available` endpoint that returns only slots where `IsAvailable` is `true`
- Add validation to prevent creating a time slot whose `EndTime` is before its `StartTime`
- Send a confirmation email (or log a message) when a booking is successfully created
