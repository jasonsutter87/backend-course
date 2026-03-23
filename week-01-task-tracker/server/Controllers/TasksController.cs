using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Data;
using TaskTracker.Models;

namespace TaskTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    /*
        the app requires the following functions
        - GetAll
        - GetById
        - Create
        - Update
        - Delete
    
    */

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _db.Tasks.ToArrayAsync();
        return Ok(tasks);     
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        if(task == null) return NotFound();
        return Ok(task);
    }


    [HttpPost]
    public async Task<IActionResult> Create(TaskItem task)
    {
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskItem updated)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        if(task == null) return NotFound();
        task.Title = updated.Title;
        task.Description = updated.Description;
        task.IsComplete = updated.IsComplete;
        await _db.SaveChangesAsync();
        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        if(task == null) return NotFound();
        _db.Remove(task);
        await _db.SaveChangesAsync();
        return Ok(task);
    }
}
