using Application.Interfaces.Services;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.HostedServices;

public class BackgroundJob : BackgroundService
{
    private readonly ILogger<BackgroundJob> _logger;
    private readonly TimeSpan _interval;
    private readonly INotificationService _notificationService;

    public BackgroundJob(ILogger<BackgroundJob> logger, INotificationService notificationService)
    {
        _logger = logger;
        _interval = TimeSpan.FromSeconds(5);
        _notificationService = notificationService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            //_logger.LogInformation("Maintenance task is running.");
            //await _notificationService.SendNotification("Ola");

            // Perform maintenance or cleanup tasks here

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
