using Microsoft.AspNetCore.Mvc;

namespace ApiGateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GatewayController : ControllerBase
{
    [HttpGet("proxy")]
    public async Task<IActionResult> Proxy([FromQuery] string url)
    {
        // TODO: Implement proxy logic to forward requests to upstream services
        await Task.CompletedTask;
        return Ok(new { message = "Proxy stub - implement forwarding logic", target = url });
    }
}
