using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventorySystem.Data;
using InventorySystem.Models;

namespace InventorySystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TransactionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _db.Transactions
            .Include(t => t.Product)
            .ToListAsync();
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transaction = await _db.Transactions
            .Include(t => t.Product)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction is null) return NotFound();
        return Ok(transaction);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Transaction transaction)
    {
        transaction.Timestamp = DateTime.UtcNow;
        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var transaction = await _db.Transactions.FindAsync(id);
        if (transaction is null) return NotFound();

        _db.Transactions.Remove(transaction);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
