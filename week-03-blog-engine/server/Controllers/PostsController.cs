using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogEngine.Data;
using BlogEngine.Models;

namespace BlogEngine.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PostsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var posts = await _db.Posts
            .Include(p => p.Comments)
            .Include(p => p.Author)
            .ToListAsync();
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _db.Posts
            .Include(p => p.Comments)
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (post is null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Post post)
    {
        post.CreatedAt = DateTime.UtcNow;
        post.UpdatedAt = DateTime.UtcNow;
        _db.Posts.Add(post);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Post updated)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null) return NotFound();

        post.Title = updated.Title;
        post.Content = updated.Content;
        post.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(post);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null) return NotFound();

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
