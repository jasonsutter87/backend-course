using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportTickets.Data;
using SupportTickets.Models;

namespace SupportTickets.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TicketsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tickets = await _db.Tickets.ToListAsync();
        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ticket = await _db.Tickets.FindAsync(id);
        if (ticket is null) return NotFound();
        return Ok(ticket);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Ticket ticket)
    {
        ticket.CreatedAt = DateTime.UtcNow;
        ticket.UpdatedAt = DateTime.UtcNow;
        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ticket);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Ticket updated)
    {
        var ticket = await _db.Tickets.FindAsync(id);
        if (ticket is null) return NotFound();

        ticket.Title = updated.Title;
        ticket.Description = updated.Description;
        ticket.Status = updated.Status;
        ticket.Priority = updated.Priority;
        ticket.AssignedTo = updated.AssignedTo;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ticket);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ticket = await _db.Tickets.FindAsync(id);
        if (ticket is null) return NotFound();

        _db.Tickets.Remove(ticket);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] TicketStatus status)
    {
        var ticket = await _db.Tickets.FindAsync(id);
        if (ticket is null) return NotFound();

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ticket);
    }

    [HttpPatch("{id}/assign")]
    public async Task<IActionResult> Assign(int id, [FromBody] string assignedTo)
    {
        var ticket = await _db.Tickets.FindAsync(id);
        if (ticket is null) return NotFound();

        ticket.AssignedTo = assignedTo;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ticket);
    }
}
