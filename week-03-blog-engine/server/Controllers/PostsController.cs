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

    /*
        The App required the following:
        - GetAll
        - GetById
        - Create
        - Update
        - Delete
    */
}
