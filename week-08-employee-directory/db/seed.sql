-- Seed data: Sample departments and employees for testing

INSERT INTO "Departments" ("Id", "Name", "ParentDepartmentId") VALUES
    (1, 'Engineering', NULL),
    (2, 'Marketing', NULL),
    (3, 'Sales', NULL),
    (4, 'Frontend', 1),
    (5, 'Backend', 1);

INSERT INTO "Employees" ("FirstName", "LastName", "Email", "Title", "DepartmentId") VALUES
    ('Alex', 'Rivera', 'alex.rivera@example.com', 'Senior Engineer', 4),
    ('Jordan', 'Kim', 'jordan.kim@example.com', 'Backend Engineer', 5),
    ('Sam', 'Patel', 'sam.patel@example.com', 'Marketing Manager', 2),
    ('Morgan', 'Chen', 'morgan.chen@example.com', 'Account Executive', 3);
