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
        var count = await _db.DataPoints.CountAsync();
        var total = await _db.DataPoints.SumAsync(d => d.Value);
        var average = count > 0 ? await _db.DataPoints.AverageAsync(d => d.Value) : 0;
        var min = count > 0 ? await _db.DataPoints.MinAsync(d => d.Value) : 0;
        var max = count > 0 ? await _db.DataPoints.MaxAsync(d => d.Value) : 0;

        return Ok(new
        {
            totalDataPoints = count,
            total,
            average,
            min,
            max
        });
    }

    [HttpGet("trend")]
    public async Task<IActionResult> GetTrend([FromQuery] string? category, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
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
