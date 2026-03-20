using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Models;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotificationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notifications = await _db.Notifications.ToListAsync();
        return Ok(notifications);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var notification = await _db.Notifications.FindAsync(id);
        if (notification is null) return NotFound();
        return Ok(notification);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Notification notification)
    {
        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = notification.Id }, notification);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Notification updated)
    {
        var notification = await _db.Notifications.FindAsync(id);
        if (notification is null) return NotFound();

        notification.Title = updated.Title;
        notification.Body = updated.Body;
        notification.Type = updated.Type;
        notification.SentAt = updated.SentAt;
        notification.IsRead = updated.IsRead;

        await _db.SaveChangesAsync();
        return Ok(notification);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var notification = await _db.Notifications.FindAsync(id);
        if (notification is null) return NotFound();

        _db.Notifications.Remove(notification);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
