using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Data;
using ExpenseTracker.Models;

namespace ExpenseTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExpensesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId)
    {
        var query = _db.Expenses.Include(e => e.Category).AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(e => e.CategoryId == categoryId.Value);

        var expenses = await query.ToListAsync();
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var expense = await _db.Expenses
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id);
        if (expense is null) return NotFound();
        return Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Expense expense)
    {
        expense.CreatedAt = DateTime.UtcNow;
        _db.Expenses.Add(expense);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Expense updated)
    {
        var expense = await _db.Expenses.FindAsync(id);
        if (expense is null) return NotFound();

        expense.Amount = updated.Amount;
        expense.Description = updated.Description;
        expense.CategoryId = updated.CategoryId;
        expense.Date = updated.Date;

        await _db.SaveChangesAsync();
        return Ok(expense);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await _db.Expenses.FindAsync(id);
        if (expense is null) return NotFound();

        _db.Expenses.Remove(expense);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
