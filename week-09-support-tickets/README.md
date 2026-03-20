# Week 9 — Support Tickets

## Objective
Build a full-featured support ticket system that demonstrates real-world CRUD patterns, enum-based state machines, and partial update endpoints. You'll learn how to model domain state using enums and expose targeted PATCH operations that update a single field rather than replacing the entire resource.

## Concepts Covered
- Full CRUD with Entity Framework Core and SQLite
- Enum types for status and priority modeling
- PATCH endpoints for targeted, partial resource updates
- `CreatedAtAction` for proper 201 responses with `Location` headers
- Timestamp management with `CreatedAt` / `UpdatedAt` fields

## Project Overview
A support ticket management API that lets teams create, track, and resolve customer issues. Tickets carry a status lifecycle (Open → InProgress → Resolved → Closed) and a priority level. Dedicated PATCH endpoints allow status changes and ticket assignment without requiring a full PUT payload.

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
| GET | `/api/tickets` | List all tickets |
| GET | `/api/tickets/{id}` | Get a single ticket by ID |
| POST | `/api/tickets` | Create a new ticket |
| PUT | `/api/tickets/{id}` | Replace all ticket fields |
| DELETE | `/api/tickets/{id}` | Delete a ticket |
| PATCH | `/api/tickets/{id}/status` | Update only the ticket status |
| PATCH | `/api/tickets/{id}/assign` | Assign the ticket to a user |

## Data Model

### Ticket

| Field | Type | Description |
|-------|------|-------------|
| `Id` | `int` | Auto-generated primary key |
| `Title` | `string` | Short summary of the issue |
| `Description` | `string` | Full description of the problem |
| `Status` | `TicketStatus` | Current lifecycle state (see enum below) |
| `Priority` | `Priority` | Urgency level (see enum below) |
| `AssignedTo` | `string?` | Username or email of the assignee (nullable) |
| `CreatedAt` | `DateTime` | UTC timestamp set on creation |
| `UpdatedAt` | `DateTime` | UTC timestamp updated on every change |

### TicketStatus (enum)

| Value | Description |
|-------|-------------|
| `Open` | Newly created, not yet being worked |
| `InProgress` | Actively being worked |
| `Resolved` | Solution applied, awaiting confirmation |
| `Closed` | Fully resolved and archived |

### Priority (enum)

| Value | Description |
|-------|-------------|
| `Low` | Non-urgent, address when possible |
| `Medium` | Normal priority |
| `High` | Needs attention soon |
| `Critical` | Drop everything — production impact |

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
# Create a new ticket
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Login broken","description":"Users cannot log in after deploy","status":0,"priority":3}'

# List all tickets
curl http://localhost:5000/api/tickets

# Get a single ticket
curl http://localhost:5000/api/tickets/1

# Update a ticket's status to InProgress (enum value 1)
curl -X PATCH http://localhost:5000/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d '1'

# Assign a ticket
curl -X PATCH http://localhost:5000/api/tickets/1/assign \
  -H "Content-Type: application/json" \
  -d '"jane@example.com"'

# Full update
curl -X PUT http://localhost:5000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Login broken","description":"Fixed in v2.1","status":2,"priority":3,"assignedTo":"jane@example.com"}'

# Delete a ticket
curl -X DELETE http://localhost:5000/api/tickets/1
```

## Key Takeaways
- PATCH endpoints let clients update a single field without resending the entire resource, reducing payload size and preventing accidental overwrites
- Enums serialize as integers by default in .NET — document the integer-to-name mapping for API consumers
- `CreatedAt` should be set server-side on creation only; `UpdatedAt` should be refreshed on every write
- `CreatedAtAction` produces a proper `201 Created` response with a `Location` header pointing to the new resource
- State machines enforced at the API layer prevent impossible transitions and keep domain logic out of the client

## Challenges (Optional)
- Add a `GET /api/tickets?status=Open&priority=High` query string filter so callers can list tickets by status and/or priority
- Enforce valid status transitions (e.g., a `Closed` ticket cannot move back to `Open`) and return `422 Unprocessable Entity` when violated
- Add a `comments` sub-resource at `POST /api/tickets/{id}/comments` so agents can append notes to a ticket
