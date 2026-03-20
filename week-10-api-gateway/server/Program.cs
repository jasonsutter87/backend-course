using Microsoft.EntityFrameworkCore;
using ApiGateway.Data;
using ApiGateway.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=../db/app.db"));
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddTransient<RateLimitingMiddleware>();
builder.Services.AddTransient<ApiKeyMiddleware>();

var app = builder.Build();

app.UseCors();
app.UseMiddleware<ApiKeyMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
