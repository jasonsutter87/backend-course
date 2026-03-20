namespace ApiGateway.Middleware;

public class ApiKeyMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // TODO: Implement API key validation from request headers
        await next(context);
    }
}
