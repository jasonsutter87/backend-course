namespace ApiGateway.Models;

public class ApiKey
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int RateLimit { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
