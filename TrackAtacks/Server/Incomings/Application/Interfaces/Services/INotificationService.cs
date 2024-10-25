namespace Application.Interfaces.Services;

public interface INotificationService
{
    Task SendNotificationAsync(string message);
}
