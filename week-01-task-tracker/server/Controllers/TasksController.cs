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
        // var tasks = await _db.Tasks.ToArrayAsync();
        // return Ok(tasks);     
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        //TODO: Finish the Controller
    }


    [HttpPost]
    public async Task<IActionResult> Create(TaskItem task)
    {
        //TODO: Finish the Controller
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskItem updated)
    {
       //TODO: Finish the Controller
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
       //TODO: Finish the Controller
    }
}
