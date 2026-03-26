namespace NotificationService.Services;

public class NotificationWorker : BackgroundService
{
    private readonly ILogger<NotificationWorker> _logger;

    public NotificationWorker(ILogger<NotificationWorker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // TODO: Implement background notification processing loop
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("NotificationWorker running at: {time}", DateTimeOffset.UtcNow);
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
