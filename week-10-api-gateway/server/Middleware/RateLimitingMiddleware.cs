using System.Collections.Concurrent;
using ApiGateway.Models;

namespace ApiGateway.Middleware;

public class RateLimitingMiddleware : IMiddleware
{
    private static readonly ConcurrentDictionary<int, (int Count, DateTime WindowStart)> _counters = new();

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Only rate-limit requests that passed API key auth
        if (!context.Items.TryGetValue("ApiKey", out var keyObj) || keyObj is not ApiKey apiKey)
        {
            await next(context);
            return;
        }

        var now = DateTime.UtcNow;
        var window = TimeSpan.FromMinutes(1);

        var entry = _counters.AddOrUpdate(
            apiKey.Id,
            _ => (1, now),
            (_, existing) =>
            {
                // Reset counter if the window has elapsed
                if (now - existing.WindowStart > window)
                    return (1, now);

                return (existing.Count + 1, existing.WindowStart);
            });

        if (entry.Count > apiKey.RateLimit && apiKey.RateLimit > 0)
        {
            context.Response.StatusCode = 429;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Rate limit exceeded",
                limit = apiKey.RateLimit,
                retryAfterSeconds = (int)(window - (now - entry.WindowStart)).TotalSeconds
            });
            return;
        }

        await next(context);
    }
}
