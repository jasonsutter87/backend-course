namespace BookingScheduler.Models;

public class Booking
{
    public int Id { get; set; }
    public int TimeSlotId { get; set; }
    public TimeSlot TimeSlot { get; set; } = null!;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public DateTime BookedAt { get; set; } = DateTime.UtcNow;
}
