namespace DashboardAnalytics.Models;

public class DashboardWidget
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string DataSource { get; set; } = string.Empty;
    public string Config { get; set; } = string.Empty;
}
