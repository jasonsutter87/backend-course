using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingScheduler.Data;
using BookingScheduler.Models;

namespace BookingScheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BookingsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bookings = await _db.Bookings
            .Include(b => b.TimeSlot)
            .ToListAsync();
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _db.Bookings
            .Include(b => b.TimeSlot)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking is null) return NotFound();
        return Ok(booking);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Booking booking)
    {
        booking.BookedAt = DateTime.UtcNow;

        var slot = await _db.TimeSlots.FindAsync(booking.TimeSlotId);
        if (slot is null) return BadRequest("TimeSlot not found.");
        if (!slot.IsAvailable) return Conflict("TimeSlot is already booked.");

        slot.IsAvailable = false;
        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var booking = await _db.Bookings
            .Include(b => b.TimeSlot)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking is null) return NotFound();

        booking.TimeSlot.IsAvailable = true;
        _db.Bookings.Remove(booking);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
