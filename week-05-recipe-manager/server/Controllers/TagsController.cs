using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeManager.Data;
using RecipeManager.Models;

namespace RecipeManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TagsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tags = await _db.Tags.ToListAsync();
        return Ok(tags);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tag = await _db.Tags.FindAsync(id);
        if (tag is null) return NotFound();
        return Ok(tag);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Tag tag)
    {
        _db.Tags.Add(tag);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tag.Id }, tag);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Tag tag)
    {
        if (id != tag.Id) return BadRequest();

        _db.Entry(tag).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tag = await _db.Tags.FindAsync(id);
        if (tag is null) return NotFound();

        _db.Tags.Remove(tag);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
