using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DashboardAnalytics.Data;
using DashboardAnalytics.Models;

namespace DashboardAnalytics.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var widgets = await _db.DashboardWidgets.ToListAsync();
        return Ok(widgets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var widget = await _db.DashboardWidgets.FindAsync(id);
        if (widget is null) return NotFound();
        return Ok(widget);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DashboardWidget widget)
    {
        _db.DashboardWidgets.Add(widget);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = widget.Id }, widget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DashboardWidget updated)
    {
        var widget = await _db.DashboardWidgets.FindAsync(id);
        if (widget is null) return NotFound();

        widget.Title = updated.Title;
        widget.Type = updated.Type;
        widget.DataSource = updated.DataSource;
        widget.Config = updated.Config;

        await _db.SaveChangesAsync();
        return Ok(widget);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var widget = await _db.DashboardWidgets.FindAsync(id);
        if (widget is null) return NotFound();

        _db.DashboardWidgets.Remove(widget);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
