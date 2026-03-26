using Microsoft.EntityFrameworkCore;

namespace ApiGateway.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // TODO: Add DbSet properties for your models here
}
