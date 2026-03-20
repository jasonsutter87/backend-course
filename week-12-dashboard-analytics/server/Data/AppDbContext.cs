using Microsoft.EntityFrameworkCore;
using DashboardAnalytics.Models;

namespace DashboardAnalytics.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<DataPoint> DataPoints => Set<DataPoint>();
    public DbSet<DashboardWidget> DashboardWidgets => Set<DashboardWidget>();
}
