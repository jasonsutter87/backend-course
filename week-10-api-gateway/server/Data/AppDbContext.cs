using Microsoft.EntityFrameworkCore;
using ApiGateway.Models;

namespace ApiGateway.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ApiKey> ApiKeys => Set<ApiKey>();
    public DbSet<RequestLog> RequestLogs => Set<RequestLog>();
}
