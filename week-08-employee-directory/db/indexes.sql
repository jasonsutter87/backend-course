-- Performance indexes for Employee Directory
-- These speed up common queries

-- Fast lookup by email (unique constraint)
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Employees_Email" ON "Employees" ("Email");

-- Fast filtering by department
CREATE INDEX IF NOT EXISTS "IX_Employees_DepartmentId" ON "Employees" ("DepartmentId");

-- Fast lookup of sub-departments
CREATE INDEX IF NOT EXISTS "IX_Departments_ParentDepartmentId" ON "Departments" ("ParentDepartmentId");

-- Composite index for name search
CREATE INDEX IF NOT EXISTS "IX_Employees_Name" ON "Employees" ("LastName", "FirstName");
