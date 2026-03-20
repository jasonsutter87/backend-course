-- Week 9: Support Tickets Schema

CREATE TABLE IF NOT EXISTS "Tickets" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Status" INTEGER NOT NULL DEFAULT 0,
    "Priority" INTEGER NOT NULL DEFAULT 0,
    "AssignedTo" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NOT NULL
);

-- Status: 0=Open, 1=InProgress, 2=Resolved, 3=Closed
-- Priority: 0=Low, 1=Medium, 2=High, 3=Critical
