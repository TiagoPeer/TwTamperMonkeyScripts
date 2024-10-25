using Core.Entities;

namespace Application.Interfaces.Services;

public interface IPlayersService
{
    Task<List<Player>> GetAllAsync();
}
