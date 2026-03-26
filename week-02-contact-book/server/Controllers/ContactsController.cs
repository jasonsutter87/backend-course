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


    /*
        The App required the following endpoints
        - GetAll
        - GetById
        - Search
        - Create
        - Update
        - Delete
    
    */


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        //Todo
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        //Todo
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        //Todo
    }

    [HttpPost]
    public async Task<IActionResult> Create(Contact contact)
    {
        //Todo
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Contact updated)
    {
        //Todo
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        //Todo
    }
}
