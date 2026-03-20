using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiGateway.Data;
using ApiGateway.Models;

namespace ApiGateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApiKeysController : ControllerBase
{
    private readonly AppDbContext _db;

    public ApiKeysController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var keys = await _db.ApiKeys.ToListAsync();
        return Ok(keys);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var key = await _db.ApiKeys.FindAsync(id);
        if (key is null) return NotFound();
        return Ok(key);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ApiKey apiKey)
    {
        apiKey.CreatedAt = DateTime.UtcNow;
        _db.ApiKeys.Add(apiKey);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = apiKey.Id }, apiKey);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ApiKey updated)
    {
        var key = await _db.ApiKeys.FindAsync(id);
        if (key is null) return NotFound();

        key.Name = updated.Name;
        key.IsActive = updated.IsActive;
        key.RateLimit = updated.RateLimit;

        await _db.SaveChangesAsync();
        return Ok(key);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var key = await _db.ApiKeys.FindAsync(id);
        if (key is null) return NotFound();

        _db.ApiKeys.Remove(key);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
