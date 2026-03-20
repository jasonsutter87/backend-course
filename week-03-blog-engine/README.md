# Week 3 — Blog Engine

## Objective
Move beyond single-table apps and work with related data across multiple models. This week introduces foreign keys, navigation properties, EF Core `Include` for eager loading, and the foundations of authentication — registering users and stubbing out a login flow that you'll complete with JWTs in a later week.

## Concepts Covered
- One-to-many relationships (User → Posts, Post → Comments)
- EF Core `Include` for eager loading related entities
- Foreign keys and navigation properties in C# models
- Multiple controllers working with a shared `AppDbContext`
- Authentication scaffolding: register endpoint and login stub
- Role-based user design (`admin` vs `reader`)

## Project Overview
A multi-user blog platform. Users can register, authors create posts, and readers leave comments. Posts are returned with their author and comments pre-loaded. The auth system has a working register endpoint; the login endpoint is stubbed and ready for JWT implementation.

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

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | Return all posts with author and comments |
| GET | /api/posts/{id} | Return a single post with author and comments |
| POST | /api/posts | Create a new post |
| PUT | /api/posts/{id} | Update a post's title and content |
| DELETE | /api/posts/{id} | Delete a post |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/comments/post/{postId} | Return all comments for a post (with authors) |
| POST | /api/comments | Create a new comment |
| DELETE | /api/comments/{id} | Delete a comment |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login stub (not yet implemented) |

## Data Model

### User

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| Username | string | Display name |
| Email | string | User's email address |
| PasswordHash | string | Stored credential (hashing not yet implemented) |
| Role | string | Either `"admin"` or `"reader"` (defaults to `"reader"`) |

### Post

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| Title | string | Post headline |
| Content | string | Full body text |
| AuthorId | int | Foreign key to User |
| Author | User? | Navigation property (eager-loaded) |
| CreatedAt | DateTime | Set automatically on creation (UTC) |
| UpdatedAt | DateTime | Updated on every PUT (UTC) |
| Comments | ICollection\<Comment\> | Navigation property (eager-loaded) |

### Comment

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key, auto-generated |
| Content | string | Comment body text |
| PostId | int | Foreign key to Post |
| Post | Post? | Navigation property |
| AuthorId | int | Foreign key to User |
| Author | User? | Navigation property (eager-loaded) |
| CreatedAt | DateTime | Set automatically on creation (UTC) |

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
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","passwordHash":"secret","role":"admin"}'

# Login (stub — returns placeholder message)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'

# Create a post (authorId must match an existing user)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World","content":"My first post.","authorId":1}'

# Get all posts (includes author and comments)
curl http://localhost:5000/api/posts

# Get a single post
curl http://localhost:5000/api/posts/1

# Update a post
curl -X PUT http://localhost:5000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content."}'

# Add a comment
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post!","postId":1,"authorId":1}'

# Get comments for a post
curl http://localhost:5000/api/comments/post/1

# Delete a comment
curl -X DELETE http://localhost:5000/api/comments/1

# Delete a post
curl -X DELETE http://localhost:5000/api/posts/1
```

## Key Takeaways
- Foreign keys in EF Core are defined as `int AuthorId` paired with a nullable navigation property `User? Author`
- `.Include(p => p.Author).Include(p => p.Comments)` tells EF Core to JOIN those tables and populate the navigation properties in one query
- Splitting API surface across multiple controllers (Posts, Comments, Auth) keeps each file focused and maintainable
- `UpdatedAt` should be set in the controller on every PUT, not left to the client
- The `login` stub is an intentional placeholder — never ship plaintext password storage to production; use BCrypt and JWTs

## Challenges (Optional)
- Implement password hashing in `AuthController.Register` using `BCrypt.Net-Next`
- Add a `[Authorize]` attribute to the DELETE endpoints so only authenticated users can delete posts and comments
- Add a `slug` field to `Post` and expose a `GET /api/posts/slug/{slug}` endpoint for SEO-friendly URLs
