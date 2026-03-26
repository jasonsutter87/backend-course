using Microsoft.EntityFrameworkCore;
using ApiGateway.Data;

namespace ApiGateway.Middleware;

public class ApiKeyMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Skip middleware for API key management and request log endpoints
        if (context.Request.Path.StartsWithSegments("/api/apikeys") ||
            context.Request.Path.StartsWithSegments("/api/requestlogs"))
        {
            await next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue("X-Api-Key", out var apiKeyHeader))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "Missing X-Api-Key header" });
            return;
        }

        var db = context.RequestServices.GetRequiredService<AppDbContext>();
        var apiKey = await db.ApiKeys.FirstOrDefaultAsync(k => k.Key == apiKeyHeader.ToString());

        if (apiKey is null || !apiKey.IsActive)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "Invalid or inactive API key" });
            return;
        }

        // Store the API key for downstream middleware and logging
        context.Items["ApiKeyId"] = apiKey.Id;
        context.Items["ApiKey"] = apiKey;

        await next(context);

        // Log the request after it completes
        var log = new Models.RequestLog
        {
            ApiKeyId = apiKey.Id,
            Endpoint = context.Request.Path,
            Method = context.Request.Method,
            StatusCode = context.Response.StatusCode,
            Timestamp = DateTime.UtcNow
        };
        db.RequestLogs.Add(log);
        await db.SaveChangesAsync();
    }
}
