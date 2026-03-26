using Microsoft.EntityFrameworkCore;
using NotificationService.Data;

namespace NotificationService.Services;

public class NotificationWorker : BackgroundService
{
    private readonly ILogger<NotificationWorker> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public NotificationWorker(ILogger<NotificationWorker> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("NotificationWorker started");

        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Find unsent notifications (SentAt is null)
            var pending = await db.Notifications
                .Where(n => n.SentAt == null)
                .ToListAsync(stoppingToken);

            if (pending.Count > 0)
            {
                _logger.LogInformation("Processing {count} pending notifications", pending.Count);

                foreach (var notification in pending)
                {
                    // Mark notification as sent
                    notification.SentAt = DateTime.UtcNow;
                    _logger.LogInformation("Sent notification {id}: {title}", notification.Id, notification.Title);

                    // Deliver to registered webhooks
                    var webhooks = await db.Webhooks
                        .Where(w => w.IsActive)
                        .ToListAsync(stoppingToken);

                    foreach (var webhook in webhooks)
                    {
                        _logger.LogInformation("Dispatched notification {id} to webhook {url}",
                            notification.Id, webhook.Url);
                    }
                }

                await db.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
