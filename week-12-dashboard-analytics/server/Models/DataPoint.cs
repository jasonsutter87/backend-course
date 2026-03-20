namespace DashboardAnalytics.Models;

public class DataPoint
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
