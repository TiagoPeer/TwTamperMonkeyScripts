
using Application.Interfaces.Services;

namespace WebAPI.HostedServices
{
    public class CommandsCleaner : BackgroundService
    {
        private readonly IIncomingsService _incomingsService;

        public CommandsCleaner(IServiceProvider serviceProvider)
        {
            _incomingsService = serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IIncomingsService>();
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(1000, cancellationToken);
                await _incomingsService.DeleteOldCommandsAsync();
            }
        }
    }
}
