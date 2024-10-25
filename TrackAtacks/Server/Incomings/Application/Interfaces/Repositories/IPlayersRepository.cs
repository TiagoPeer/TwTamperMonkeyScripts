using Core.Entities;

namespace Application.Interfaces.Repositories;

public interface IPlayersRepository
{
    Task<List<Player>> GetAllAsync();
}
