using Microsoft.AspNetCore.Mvc;
using BlogEngine.Data;
using BlogEngine.Models;

namespace BlogEngine.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        // TODO: hash password before storing
        // TODO: validate that username/email are not already taken
        user.PasswordHash = user.PasswordHash; // placeholder — replace with BCrypt or similar
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Registered successfully", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // TODO: look up user by email, verify hashed password, return JWT or session token
        return Ok(new { message = "Login stub — not yet implemented" });
    }
}

public record LoginRequest(string Email, string Password);
