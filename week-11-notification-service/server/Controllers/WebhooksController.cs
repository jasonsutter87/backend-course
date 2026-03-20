using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Models;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly AppDbContext _db;

    public WebhooksController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var webhooks = await _db.Webhooks.ToListAsync();
        return Ok(webhooks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var webhook = await _db.Webhooks.FindAsync(id);
        if (webhook is null) return NotFound();
        return Ok(webhook);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Webhook webhook)
    {
        _db.Webhooks.Add(webhook);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = webhook.Id }, webhook);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Webhook updated)
    {
        var webhook = await _db.Webhooks.FindAsync(id);
        if (webhook is null) return NotFound();

        webhook.Url = updated.Url;
        webhook.Secret = updated.Secret;
        webhook.IsActive = updated.IsActive;
        webhook.Events = updated.Events;

        await _db.SaveChangesAsync();
        return Ok(webhook);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var webhook = await _db.Webhooks.FindAsync(id);
        if (webhook is null) return NotFound();

        _db.Webhooks.Remove(webhook);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
