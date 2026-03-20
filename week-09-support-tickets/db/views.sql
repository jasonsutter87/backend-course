-- SQL Views for Support Tickets
-- Views are virtual tables based on queries — great for reporting

-- Open tickets summary by priority
CREATE VIEW IF NOT EXISTS vw_OpenTicketsByPriority AS
SELECT
    CASE Priority
        WHEN 0 THEN 'Low'
        WHEN 1 THEN 'Medium'
        WHEN 2 THEN 'High'
        WHEN 3 THEN 'Critical'
    END AS PriorityLevel,
    COUNT(*) AS TicketCount
FROM Tickets
WHERE Status IN (0, 1)
GROUP BY Priority
ORDER BY Priority DESC;

-- Tickets assigned per person
CREATE VIEW IF NOT EXISTS vw_TicketsPerAssignee AS
SELECT
    COALESCE(AssignedTo, 'Unassigned') AS Assignee,
    COUNT(*) AS TotalTickets,
    SUM(CASE WHEN Status = 0 THEN 1 ELSE 0 END) AS OpenCount,
    SUM(CASE WHEN Status = 1 THEN 1 ELSE 0 END) AS InProgressCount,
    SUM(CASE WHEN Status = 2 THEN 1 ELSE 0 END) AS ResolvedCount
FROM Tickets
GROUP BY AssignedTo;

-- Average resolution time (for closed tickets)
CREATE VIEW IF NOT EXISTS vw_ResolutionTime AS
SELECT
    AssignedTo,
    COUNT(*) AS ClosedTickets,
    AVG(julianday(UpdatedAt) - julianday(CreatedAt)) AS AvgDaysToResolve
FROM Tickets
WHERE Status = 3
GROUP BY AssignedTo;
