# 12-Week Backend Development Course

A hands-on backend course built around 12 progressively complex projects. Each week introduces new concepts while reinforcing fundamentals.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19 (standalone components) |
| Backend | ASP.NET MVC (.NET 10) |
| Database | SQLite (via Entity Framework Core) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.dev/) (`npm install -g @angular/cli`)
- [.NET 10 SDK](https://dotnet.microsoft.com/download)

### Running a Project

Each week follows the same structure:

```
week-XX-project-name/
├── client/    # Angular frontend
├── server/    # ASP.NET MVC backend
└── db/        # SQLite database (auto-created on first run)
```

**Start the backend:**
```bash
cd week-01-task-tracker/server
dotnet run --urls="http://localhost:5000"
```

**Start the frontend (in a separate terminal):**
```bash
cd week-01-task-tracker/client
npm install
ng serve
```

Open **http://localhost:4200** in your browser.

---

## Weekly Breakdown

### Week 1 — Task Tracker
**Concepts:** CRUD operations, models, controllers, basic routing
- Create, read, update, delete tasks
- Status toggling (complete/incomplete)
- Simple list and detail views

### Week 2 — Contact Book
**Concepts:** Form validation, search/filter, pagination
- Add/edit/delete contacts with validation
- Search by name, email, phone
- Paginated results from the API

### Week 3 — Blog Engine
**Concepts:** Authentication, authorization, entity relationships
- User registration and login
- Admin vs reader roles
- Posts with comments (one-to-many relationships)

### Week 4 — Expense Tracker
**Concepts:** Aggregations, date filtering, reporting endpoints
- Log expenses by category and date
- Monthly/weekly summaries
- Filtered reporting endpoints

### Week 5 — Recipe Manager
**Concepts:** File uploads, tags/categories, many-to-many relationships
- Create recipes with image uploads
- Tag system with many-to-many relationships
- Filter by tags, ingredients, difficulty

### Week 6 — Inventory System
**Concepts:** Stock tracking, transaction history, business logic
- Products with stock levels
- Stock in/out transactions with history
- Low-stock alerts and threshold logic

### Week 7 — Booking / Scheduler
**Concepts:** Date/time logic, conflict detection, availability
- Create and manage bookable time slots
- Detect scheduling conflicts
- Availability checking endpoints

### Week 8 — Employee Directory
**Concepts:** Hierarchical data, bulk operations, import/export
- Departments and employees (parent-child)
- Org chart data structure
- CSV import/export endpoints

### Week 9 — Support Ticket System
**Concepts:** Status workflows, assignment logic, priority queues
- Ticket creation with priority levels
- Status workflow (open → in progress → resolved → closed)
- Auto-assignment and escalation logic

### Week 10 — REST API Gateway *(DIY Frontend)*
**Concepts:** API keys, rate limiting, middleware
- API key generation and validation
- Rate limiting middleware
- Request logging and analytics

### Week 11 — Notification Service *(DIY Frontend)*
**Concepts:** Background jobs, webhooks, queues
- Event-driven notifications
- Email and webhook delivery
- Background job processing with queues

### Week 12 — Dashboard Analytics *(DIY Frontend)*
**Concepts:** Data aggregation, caching, performance optimization
- Aggregate data from previous projects
- Response caching strategies
- Query optimization and performance tuning

---

## Frontend Notes

- **Weeks 1–9:** Full Angular frontends provided (components, services, routing, HTML, CSS)
- **Weeks 10–12:** HTML and CSS are complete, but Angular services are **stubs with TODO comments** — wire up the API connections yourself as a learning exercise

Look for `// TODO:` comments in the service files for weeks 10-12 to know exactly what to implement.

## License

MIT
