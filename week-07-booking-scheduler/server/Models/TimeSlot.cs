namespace BookingScheduler.Models;

public class TimeSlot
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;

    public Booking? Booking { get; set; }
}
