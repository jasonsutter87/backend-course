using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DashboardAnalytics.Data;
using DashboardAnalytics.Models;

namespace DashboardAnalytics.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AnalyticsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        // TODO: Implement summary aggregation across DataPoints
        var count = await _db.DataPoints.CountAsync();
        return Ok(new { totalDataPoints = count });
    }

    [HttpGet("trend")]
    public async Task<IActionResult> GetTrend([FromQuery] string? category, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        // TODO: Implement trend analysis filtered by category and date range
        var query = _db.DataPoints.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(d => d.Category == category);

        if (from.HasValue)
            query = query.Where(d => d.Timestamp >= from.Value);

        if (to.HasValue)
            query = query.Where(d => d.Timestamp <= to.Value);

        var data = await query.OrderBy(d => d.Timestamp).ToListAsync();
        return Ok(data);
    }
}
