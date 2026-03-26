using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogEngine.Data;
using BlogEngine.Models;
using System.Security.Cryptography;
using System.Text;

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
        //Type Dont uncomment 


        // var exists = await _db.Users.AnyAsync(u => u.Email == user.Email || u.Username == user.Username);
        // if (exists)
        //     return Conflict(new { error = "Username or email is already taken" });

        // user.PasswordHash = HashPassword(user.PasswordHash);
        // _db.Users.Add(user);
        // await _db.SaveChangesAsync();
        // return Ok(new { message = "Registered successfully", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        //Type Dont uncomment 

        // var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        // if (user is null || user.PasswordHash != HashPassword(request.Password))
        //     return Unauthorized(new { error = "Invalid email or password" });

        // return Ok(new { message = "Login successful", userId = user.Id, role = user.Role });
    }

    private static string HashPassword(string password)
    {
        //Type Dont uncomment 

        // var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        // return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}

public record LoginRequest(string Email, string Password);
