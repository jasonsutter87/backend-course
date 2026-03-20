using Microsoft.EntityFrameworkCore;
using BookingScheduler.Models;

namespace BookingScheduler.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TimeSlot> TimeSlots => Set<TimeSlot>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed data
        modelBuilder.Entity<TimeSlot>().HasData(
            new TimeSlot { Id = 1, StartTime = new DateTime(2026, 4, 1, 9, 0, 0), EndTime = new DateTime(2026, 4, 1, 10, 0, 0), IsAvailable = true },
            new TimeSlot { Id = 2, StartTime = new DateTime(2026, 4, 1, 10, 0, 0), EndTime = new DateTime(2026, 4, 1, 11, 0, 0), IsAvailable = true },
            new TimeSlot { Id = 3, StartTime = new DateTime(2026, 4, 1, 11, 0, 0), EndTime = new DateTime(2026, 4, 1, 12, 0, 0), IsAvailable = true },
            new TimeSlot { Id = 4, StartTime = new DateTime(2026, 4, 1, 13, 0, 0), EndTime = new DateTime(2026, 4, 1, 14, 0, 0), IsAvailable = true },
            new TimeSlot { Id = 5, StartTime = new DateTime(2026, 4, 1, 14, 0, 0), EndTime = new DateTime(2026, 4, 1, 15, 0, 0), IsAvailable = true }
        );
    }
}
