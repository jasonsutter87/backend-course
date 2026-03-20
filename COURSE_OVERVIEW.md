# 12-Week Backend Development Course

## Stack
- **Frontend:** Angular
- **Backend:** ASP.NET MVC (.NET)
- **Database:** SQLite

## Goal
Build 12 progressively complex backend projects, each reinforcing core .NET MVC concepts while layering on new skills. Frontends are pre-built in Angular so the focus stays on backend development.

---

## Projects

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

### Week 10 — REST API Gateway
**Concepts:** API keys, rate limiting, middleware
- API key generation and validation
- Rate limiting middleware
- Request logging and analytics
- *Frontend: HTML/CSS provided, services/connections are DIY*

### Week 11 — Notification Service
**Concepts:** Background jobs, webhooks, queues
- Event-driven notifications
- Email and webhook delivery
- Background job processing with queues
- *Frontend: HTML/CSS provided, services/connections are DIY*

### Week 12 — Dashboard Analytics API
**Concepts:** Data aggregation, caching, performance optimization
- Aggregate data from previous projects
- Response caching strategies
- Query optimization and performance tuning
- *Frontend: HTML/CSS provided, services/connections are DIY*

---

## Folder Structure
Each project follows the same layout:
```
week-XX-project-name/
├── client/    # Angular frontend
├── server/    # ASP.NET MVC backend
└── db/        # SQLite database & migrations
```

## Notes
- Weeks 1–9: Full frontend (Angular services, components, HTML, CSS) provided
- Weeks 10–12: HTML/CSS provided, but Angular services and API connections are left as exercises
