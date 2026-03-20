namespace ApiGateway.Models;

public class RequestLog
{
    public int Id { get; set; }
    public int ApiKeyId { get; set; }
    public string Endpoint { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
