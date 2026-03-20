# Stored Procedures & SQLite

SQLite doesn't support stored procedures natively. In production, you'd use SQL Server, PostgreSQL, or MySQL which do.

## What Are Stored Procedures?
Pre-compiled SQL that lives in the database. Benefits:
- Performance (pre-compiled execution plan)
- Security (parameterized, limited access)
- Reusability (call from any app)

## SQL Server Example (What You'd Write at Work)
```sql
CREATE PROCEDURE sp_MarkNotificationsRead
    @UserId INT,
    @BeforeDate DATETIME
AS
BEGIN
    UPDATE Notifications
    SET IsRead = 1
    WHERE UserId = @UserId
      AND SentAt <= @BeforeDate
      AND IsRead = 0;

    SELECT @@ROWCOUNT AS UpdatedCount;
END
```

## SQLite Equivalent (What We Use Here)
In SQLite, we achieve the same thing with raw SQL via EF Core:
```csharp
var count = await _db.Database.ExecuteSqlRawAsync(
    "UPDATE Notifications SET IsRead = 1 WHERE SentAt <= {0} AND IsRead = 0",
    beforeDate);
```

## When to Use Stored Procedures
- Complex business logic that multiple apps need
- Batch operations (bulk updates, cleanups)
- Reporting queries that need to be fast
- When you want to limit what the app can do (security)
