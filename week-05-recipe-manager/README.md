# Week 5 — Recipe Manager

## Objective
Learn how to model many-to-many relationships in a relational database using a join table. This week introduces EF Core navigation properties, `Include`/`ThenInclude` for eager loading, and how to expose related data through a REST API.

## Concepts Covered
- Many-to-many relationships via a join entity (`RecipeTag`)
- EF Core `Include` and `ThenInclude` for eager loading nested data
- Multiple controllers managing related resources
- RESTful CRUD for two independent resources with a shared relationship

## Project Overview
A recipe management app where users can create recipes and organize them with tags. Each recipe can have multiple tags (e.g., "vegetarian", "quick", "dinner"), and each tag can be applied to many recipes. The API supports full CRUD for both recipes and tags.

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
Whenever you change a model (e.g., add a field to `Recipe`):
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
| GET | `/api/recipes` | Get all recipes with their tags |
| GET | `/api/recipes/{id}` | Get a single recipe with its tags |
| POST | `/api/recipes` | Create a new recipe |
| PUT | `/api/recipes/{id}` | Update an existing recipe |
| DELETE | `/api/recipes/{id}` | Delete a recipe |
| GET | `/api/tags` | Get all tags |
| GET | `/api/tags/{id}` | Get a single tag |
| POST | `/api/tags` | Create a new tag |
| PUT | `/api/tags/{id}` | Update an existing tag |
| DELETE | `/api/tags/{id}` | Delete a tag |

## Data Model

### Recipe

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `Name` | string | Recipe name |
| `Description` | string | Description of the recipe |
| `ImageUrl` | string | URL to a recipe image |
| `Difficulty` | string | Difficulty level (e.g., Easy, Medium, Hard) |
| `RecipeTags` | ICollection\<RecipeTag\> | Navigation property — associated tags |

### Tag

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `Name` | string | Tag label (e.g., "vegetarian", "quick") |
| `RecipeTags` | ICollection\<RecipeTag\> | Navigation property — associated recipes |

### RecipeTag (join table)

| Field | Type | Description |
|-------|------|-------------|
| `RecipeId` | int | Foreign key to Recipe |
| `TagId` | int | Foreign key to Tag |

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
# Get all recipes (with tags eagerly loaded)
curl http://localhost:5000/api/recipes

# Create a recipe
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"name":"Pasta Primavera","description":"Light veggie pasta","imageUrl":"","difficulty":"Easy"}'

# Create a tag
curl -X POST http://localhost:5000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"vegetarian"}'

# Get a single recipe by ID
curl http://localhost:5000/api/recipes/1

# Update a recipe
curl -X PUT http://localhost:5000/api/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Pasta Primavera","description":"Updated description","imageUrl":"","difficulty":"Medium"}'

# Delete a recipe
curl -X DELETE http://localhost:5000/api/recipes/1
```

## Key Takeaways
- A join table (like `RecipeTag`) is the standard way to model many-to-many relationships in a relational database
- EF Core's `Include().ThenInclude()` chain lets you traverse multiple levels of relationships in a single query
- Separating resources into their own controllers keeps each controller focused and easy to reason about
- Navigation properties in EF Core models are declared but not queried unless explicitly included
- Returning related data in a single API response reduces the number of round trips the frontend must make

## Challenges (Optional)
- Add a `GET /api/recipes?tag=vegetarian` query parameter to filter recipes by tag name
- Add an endpoint to bulk-assign multiple tags to a recipe in one request
- Add a `PrepTimeMinutes` field to `Recipe` and allow sorting recipes by prep time
