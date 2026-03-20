using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactBook.Data;
using ContactBook.Models;

namespace ContactBook.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContactsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var contacts = await _db.Contacts.ToListAsync();
        return Ok(contacts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var contact = await _db.Contacts.FindAsync(id);
        if (contact is null) return NotFound();
        return Ok(contact);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return BadRequest("Query parameter is required.");

        var lower = query.ToLower();
        var results = await _db.Contacts
            .Where(c =>
                c.FirstName.ToLower().Contains(lower) ||
                c.LastName.ToLower().Contains(lower) ||
                c.Email.ToLower().Contains(lower))
            .ToListAsync();

        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Contact contact)
    {
        contact.CreatedAt = DateTime.UtcNow;
        _db.Contacts.Add(contact);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Contact updated)
    {
        var contact = await _db.Contacts.FindAsync(id);
        if (contact is null) return NotFound();

        contact.FirstName = updated.FirstName;
        contact.LastName = updated.LastName;
        contact.Email = updated.Email;
        contact.Phone = updated.Phone;

        await _db.SaveChangesAsync();
        return Ok(contact);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var contact = await _db.Contacts.FindAsync(id);
        if (contact is null) return NotFound();

        _db.Contacts.Remove(contact);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
