# Query Optimization & Performance

## EXPLAIN QUERY PLAN
SQLite's way to show how a query executes:
```sql
EXPLAIN QUERY PLAN
SELECT * FROM DataPoints WHERE Category = 'revenue' ORDER BY Timestamp DESC;
```

Look for:
- `SCAN` = reading every row (slow on big tables)
- `SEARCH` = using an index (fast)
- `USING INDEX` = which index it picked

## Before and After Indexing
```sql
-- Without index: SCAN TABLE DataPoints
EXPLAIN QUERY PLAN
SELECT * FROM DataPoints WHERE Category = 'revenue';

-- Add index
CREATE INDEX IX_DataPoints_Category ON DataPoints(Category);

-- With index: SEARCH TABLE DataPoints USING INDEX IX_DataPoints_Category
EXPLAIN QUERY PLAN
SELECT * FROM DataPoints WHERE Category = 'revenue';
```

## Common Optimization Patterns

### 1. Covering Indexes
Include all queried columns in the index so the DB never touches the table:
```sql
CREATE INDEX IX_DataPoints_Cover ON DataPoints(Category, Timestamp, Value);
```

### 2. Avoid SELECT *
Only select the columns you need:
```sql
-- Bad
SELECT * FROM DataPoints WHERE Category = 'revenue';
-- Good
SELECT Label, Value, Timestamp FROM DataPoints WHERE Category = 'revenue';
```

### 3. Pagination
Don't load everything:
```sql
SELECT * FROM DataPoints
ORDER BY Timestamp DESC
LIMIT 20 OFFSET 40;  -- Page 3, 20 per page
```

### 4. Aggregation Performance
Pre-aggregate when possible:
```sql
-- Slow: aggregate on every request
SELECT Category, AVG(Value) FROM DataPoints GROUP BY Category;

-- Fast: materialized view (create a summary table, update periodically)
CREATE TABLE DataPointSummary AS
SELECT Category, AVG(Value) as AvgValue, COUNT(*) as Count
FROM DataPoints GROUP BY Category;
```

## EF Core Query Logging
Add to Program.cs to see generated SQL:
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=../db/app.db")
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging());
```
