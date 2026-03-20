-- Week 8: Employee Directory Schema
-- This is what EF Core Migrations generates under the hood

CREATE TABLE IF NOT EXISTS "Departments" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ParentDepartmentId" INTEGER NULL,
    FOREIGN KEY ("ParentDepartmentId") REFERENCES "Departments" ("Id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "Employees" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "DepartmentId" INTEGER NOT NULL,
    FOREIGN KEY ("DepartmentId") REFERENCES "Departments" ("Id") ON DELETE CASCADE
);
