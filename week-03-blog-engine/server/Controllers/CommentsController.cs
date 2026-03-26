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
       //Todo
    }

    [HttpPost]
    public async Task<IActionResult> Create(Comment comment)
    {
      //Todo
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
       //Todo
    }
}
