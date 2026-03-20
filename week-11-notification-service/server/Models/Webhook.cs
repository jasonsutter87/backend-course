namespace NotificationService.Models;

public class Webhook
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string Events { get; set; } = string.Empty;
}
