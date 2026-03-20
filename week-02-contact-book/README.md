# Week 2 — Contact Book

## Objective
Extend your CRUD skills by adding server-side search to an API. This week you'll learn how to accept query parameters, filter database results using LINQ, and think about what makes an API genuinely useful beyond basic create-and-retrieve operations.

## Concepts Covered
- Query parameters with `[FromQuery]`
- LINQ `Where` filtering on the database
- Case-insensitive string searching
- Returning meaningful error responses (400 Bad Request vs 404 Not Found)
- Designing a slightly richer data model with multiple string fields

## Project Overview
A personal contact book where users can store and look up people by name or email. The app supports full CRUD for contacts and includes a dedicated search endpoint that filters across first name, last name, and email fields simultaneously.

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
| GET | /api/contacts | Return all contacts |
| GET | /api/contacts/{id} | Return a single contact by ID |
| GET | /api/contacts/search?query={term} | Search contacts by name or email |
| POST | /api/contacts | Create a new contact |
| PUT | /api/contacts/{id} | Update an existing contact |
| DELETE | /api/contacts/{id} | Delete a contact |

## Data Model

### Contact

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| FirstName | string | Contact's first name |
| LastName | string | Contact's last name |
| Email | string | Contact's email address |
| Phone | string | Contact's phone number |
| CreatedAt | DateTime | Timestamp set automatically on creation (UTC) |

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
# Get all contacts
curl http://localhost:5000/api/contacts

# Get a single contact
curl http://localhost:5000/api/contacts/1

# Search contacts
curl "http://localhost:5000/api/contacts/search?query=smith"

# Create a contact
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith","email":"jane@example.com","phone":"555-1234"}'

# Update a contact
curl -X PUT http://localhost:5000/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith","email":"jane.smith@example.com","phone":"555-5678"}'

# Delete a contact
curl -X DELETE http://localhost:5000/api/contacts/1
```

## Key Takeaways
- `[FromQuery]` binds URL query parameters directly to action method arguments
- LINQ `.Where()` with `.ToLower().Contains()` enables flexible, case-insensitive text search
- Returning `BadRequest` when a required parameter is missing gives API consumers a clear signal about what went wrong
- Route ordering matters — the `search` route must be declared before `{id}` to avoid ASP.NET Core treating "search" as an integer ID
- Filtering happens in the database (translated to SQL), not in memory — this matters for performance at scale

## Challenges (Optional)
- Add a `GET /api/contacts/search?query=&field=email` parameter so callers can restrict which field to search
- Add a `Notes` field to the Contact model for free-form text
- Sort the results of `GetAll` alphabetically by last name, then first name
