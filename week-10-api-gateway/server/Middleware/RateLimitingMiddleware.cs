namespace ApiGateway.Middleware;

public class RateLimitingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // TODO: Implement rate limiting logic based on ApiKey.RateLimit
        await next(context);
    }
}
