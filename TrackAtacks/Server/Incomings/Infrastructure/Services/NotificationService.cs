using Application.Interfaces.Services;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Services;
public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationsHub> _hubContext;

    public NotificationService(IHubContext<NotificationsHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(string message)
    {
        await _hubContext.Clients.All.SendAsync("SendMessage", message);
    }
}
