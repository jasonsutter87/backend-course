# Week 8 — Employee Directory

## Objective
Learn how to model self-referential (recursive) relationships in a relational database. This week explores hierarchical data structures, how EF Core handles a table that references itself, and how to expose nested organizational relationships through a REST API.

## Concepts Covered
- Self-referential (recursive) foreign keys — a department can have a parent department of the same type
- Hierarchical data modeling (organizational trees)
- EF Core navigation properties for both parent and children on the same entity
- Many-to-one relationship between `Employee` and `Department`
- Eager loading with `Include` to hydrate foreign key references in API responses

## Project Overview
An employee directory app for browsing staff and org structure. Departments can be nested under parent departments to model a company hierarchy (e.g., Engineering > Frontend, Engineering > Backend). Each employee belongs to exactly one department. The API supports full CRUD for both employees and departments, with department responses including their parent and sub-departments.

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

This project uses **EF Core Migrations** with seed data and performance indexes. Running migrations creates the schema, populates starter departments and employees, and applies all indexes in a single step.

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

### Seed Data
Seed data is defined in `AppDbContext.OnModelCreating` using `HasData()`. After running `database update` you will have three top-level departments (Engineering, Marketing, Sales), two sub-departments (Frontend, Backend under Engineering), and four sample employees. See `db/seed.sql` for the equivalent raw SQL.

### Indexes
Indexes are declared in `AppDbContext.OnModelCreating` using the EF Core Fluent API and are applied as part of the migration. This project adds the following indexes:

| Index | Purpose |
|-------|---------|
| `IX_Employees_Email` (unique) | Fast, unique lookup by email address |
| `IX_Employees_DepartmentId` | Fast filtering of employees by department |
| `IX_Employees_Name` (LastName, FirstName) | Fast name search — composite covers both columns |
| `IX_Departments_ParentDepartmentId` | Fast lookup of sub-departments for a given parent |

**When to add an index:** Add one when you have a column you frequently filter or sort by and the table has more than a few hundred rows. Every index speeds up reads but adds a small cost to writes, so index purposefully. See `db/indexes.sql` for the raw SQL equivalents.

### Updating the Schema
Whenever you change a model, index configuration, or seed data:
1. Make the change in the model class or `AppDbContext`
2. `dotnet ef migrations add DescriptiveNameHere`
3. `dotnet ef database update`

### Useful Commands
| Command | What it does |
|---------|--------------|
| `dotnet ef migrations list` | Show all applied and pending migrations |
| `dotnet ef migrations remove` | Remove the last migration (only if not yet applied) |
| `dotnet ef database drop` | Delete the database file entirely |
| `dotnet ef migrations script` | Output the raw SQL for all migrations |

See `db/migrations-guide.md` for a full walkthrough, `db/schema.sql` for table DDL, and `db/indexes.sql` for index DDL.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees with their department |
| GET | `/api/employees/{id}` | Get a single employee with their department |
| POST | `/api/employees` | Create a new employee |
| PUT | `/api/employees/{id}` | Update an existing employee |
| DELETE | `/api/employees/{id}` | Delete an employee |
| GET | `/api/departments` | Get all departments with their parent department |
| GET | `/api/departments/{id}` | Get a department with its parent and all sub-departments |
| POST | `/api/departments` | Create a new department |
| PUT | `/api/departments/{id}` | Update an existing department |
| DELETE | `/api/departments/{id}` | Delete a department |

## Data Model

### Employee

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `FirstName` | string | Employee's first name |
| `LastName` | string | Employee's last name |
| `Email` | string | Employee's email address |
| `Title` | string | Job title (e.g., "Software Engineer") |
| `DepartmentId` | int | Foreign key to the employee's department |
| `Department` | Department | Navigation property — the employee's department |

### Department

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `Name` | string | Department name (e.g., "Engineering") |
| `ParentDepartmentId` | int? | Self-referential foreign key (nullable — top-level departments have no parent) |
| `ParentDepartment` | Department? | Navigation property — the parent department |
| `SubDepartments` | ICollection\<Department\> | Navigation property — child departments |
| `Employees` | ICollection\<Employee\> | Navigation property — employees in this department |

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
# Create a top-level department (no parent)
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name":"Engineering","parentDepartmentId":null}'

# Create a sub-department under Engineering (assuming Engineering has id 1)
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name":"Frontend","parentDepartmentId":1}'

# Get all departments (shows parent info)
curl http://localhost:5000/api/departments

# Get a single department with its parent and sub-departments
curl http://localhost:5000/api/departments/1

# Create an employee in the Frontend department (assuming id 2)
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alex","lastName":"Rivera","email":"alex@example.com","title":"Senior Engineer","departmentId":2}'

# Get all employees with their department
curl http://localhost:5000/api/employees

# Update an employee
curl -X PUT http://localhost:5000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"firstName":"Alex","lastName":"Rivera","email":"alex@example.com","title":"Staff Engineer","departmentId":2}'

# Delete an employee
curl -X DELETE http://localhost:5000/api/employees/1
```

## Key Takeaways
- A self-referential foreign key (`ParentDepartmentId` pointing back to `Department.Id`) is the standard SQL pattern for tree-structured data
- EF Core handles recursive relationships by treating the parent and child navigation properties as two sides of the same foreign key
- The `GetById` response for departments includes both parent and sub-departments — `GetAll` only includes the parent to avoid deep nesting
- Nullable foreign keys (`int?`) are how you represent optional relationships — a top-level department simply has a `null` parent
- Hierarchical data is common in real applications: org charts, category trees, file systems, and comment threads all follow this pattern

## Challenges (Optional)
- Add a `GET /api/departments/{id}/employees` endpoint that returns all employees belonging to a specific department
- Write a recursive method that returns a full department tree (a department plus all nested sub-departments) in a single response
- Add a `GET /api/employees/search?name=alex` endpoint that filters employees by first or last name
