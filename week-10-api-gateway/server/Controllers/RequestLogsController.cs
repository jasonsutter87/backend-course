using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiGateway.Data;

namespace ApiGateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestLogsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RequestLogsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? apiKeyId)
    {
        var query = _db.RequestLogs.AsQueryable();

        if (apiKeyId.HasValue)
            query = query.Where(l => l.ApiKeyId == apiKeyId.Value);

        var logs = await query.OrderByDescending(l => l.Timestamp).ToListAsync();
        return Ok(logs);
    }
}
