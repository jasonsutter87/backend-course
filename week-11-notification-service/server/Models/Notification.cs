namespace NotificationService.Models;

public class Notification
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public DateTime? SentAt { get; set; }
    public bool IsRead { get; set; } = false;
}
