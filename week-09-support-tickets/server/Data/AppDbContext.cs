using Microsoft.EntityFrameworkCore;
using SupportTickets.Models;

namespace SupportTickets.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Ticket> Tickets => Set<Ticket>();
}
