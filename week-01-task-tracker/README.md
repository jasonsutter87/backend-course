# Week 1 — Task Tracker

## Objective
Build your first full-stack app with a .NET REST API and an Angular frontend. This week establishes the core pattern you'll repeat throughout the course: define a model, wire up a database context, expose CRUD endpoints, and connect a UI that consumes them.

## Concepts Covered
- RESTful API design (GET, POST, PUT, DELETE)
- ASP.NET Core controllers and routing
- Entity Framework Core with SQLite
- Dependency injection
- Angular HttpClient and component basics

## Project Overview
A simple task management app. Users can create, view, update, and delete tasks. Each task has a title, description, and a completion flag. The API supports full CRUD over a SQLite database that is created automatically on first run.

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
| GET | /api/tasks | Return all tasks |
| GET | /api/tasks/{id} | Return a single task by ID |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/{id} | Update an existing task |
| DELETE | /api/tasks/{id} | Delete a task |

## Data Model

### TaskItem

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| Title | string | Short name for the task |
| Description | string | Longer details about the task |
| IsComplete | bool | Whether the task has been completed |
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
# Get all tasks
curl http://localhost:5000/api/tasks

# Get a single task
curl http://localhost:5000/api/tasks/1

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","isComplete":false}'

# Update a task
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","isComplete":true}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/1
```

## Key Takeaways
- A REST API maps HTTP verbs (GET/POST/PUT/DELETE) to database operations (Read/Create/Update/Delete)
- Entity Framework Core handles SQL generation — you work with C# objects, not raw queries
- `[ApiController]` and `[Route]` attributes are how ASP.NET Core knows how to dispatch requests
- `CreatedAtAction` returns a 201 response with a `Location` header pointing to the new resource
- SQLite is a zero-config database ideal for learning and local development

## Challenges (Optional)
- Add a `DueDate` field to `TaskItem` and update the PUT endpoint to accept it
- Add a `GET /api/tasks?isComplete=true` query parameter to filter tasks by completion status
- Add server-side validation so that `Title` cannot be empty (look into `[Required]` data annotations)
