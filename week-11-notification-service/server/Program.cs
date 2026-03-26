using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=../db/app.db"));
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddHostedService<NotificationWorker>();

var app = builder.Build();

app.UseCors();
app.MapControllers();

// Database is managed via EF Core Migrations
// Run: dotnet ef database update

app.Run();
