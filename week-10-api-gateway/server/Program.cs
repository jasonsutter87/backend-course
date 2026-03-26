using Microsoft.EntityFrameworkCore;
using ApiGateway.Data;
using ApiGateway.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=../db/app.db"));
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddTransient<RateLimitingMiddleware>();
builder.Services.AddTransient<ApiKeyMiddleware>();

var app = builder.Build();

app.UseCors();
app.UseMiddleware<ApiKeyMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();
app.MapControllers();

// Database is managed via EF Core Migrations
// Run: dotnet ef database update

app.Run();
