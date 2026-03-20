using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogEngine.Data;
using BlogEngine.Models;

namespace BlogEngine.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public CommentsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetByPostId(int postId)
    {
        var comments = await _db.Comments
            .Include(c => c.Author)
            .Where(c => c.PostId == postId)
            .ToListAsync();
        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Comment comment)
    {
        comment.CreatedAt = DateTime.UtcNow;
        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByPostId), new { postId = comment.PostId }, comment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var comment = await _db.Comments.FindAsync(id);
        if (comment is null) return NotFound();

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
