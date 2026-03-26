using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Data;

namespace ExpenseTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReportsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthly([FromQuery] int? year, [FromQuery] int? month)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;
        var targetMonth = month ?? DateTime.UtcNow.Month;

        var expenses = await _db.Expenses
            .Where(e => e.Date.Year == targetYear && e.Date.Month == targetMonth)
            .ToListAsync();

        var total = expenses.Sum(e => e.Amount);

        return Ok(new
        {
            year = targetYear,
            month = targetMonth,
            total,
            count = expenses.Count,
            expenses
        });
    }

    [HttpGet("by-category")]
    public async Task<IActionResult> GetByCategory()
    {
        var results = await _db.Expenses
            .Include(e => e.Category)
            .GroupBy(e => new { e.CategoryId, e.Category!.Name })
            .Select(g => new
            {
                categoryId = g.Key.CategoryId,
                categoryName = g.Key.Name,
                total = g.Sum(e => e.Amount),
                count = g.Count()
            })
            .ToListAsync();

        return Ok(results);
    }
}
