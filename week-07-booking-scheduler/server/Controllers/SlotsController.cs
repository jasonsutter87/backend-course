using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingScheduler.Data;
using BookingScheduler.Models;

namespace BookingScheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SlotsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var slots = await _db.TimeSlots.ToListAsync();
        return Ok(slots);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var slot = await _db.TimeSlots.FindAsync(id);
        if (slot is null) return NotFound();
        return Ok(slot);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TimeSlot slot)
    {
        _db.TimeSlots.Add(slot);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = slot.Id }, slot);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TimeSlot slot)
    {
        if (id != slot.Id) return BadRequest();

        _db.Entry(slot).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var slot = await _db.TimeSlots.FindAsync(id);
        if (slot is null) return NotFound();

        _db.TimeSlots.Remove(slot);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
