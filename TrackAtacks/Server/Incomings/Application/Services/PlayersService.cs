using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Core.Entities;

namespace Application.Services;

public class PlayersService : IPlayersService
{
    private readonly IPlayersRepository _playersRepository;

    public PlayersService(IPlayersRepository playersRepository)
    {
        _playersRepository = playersRepository;
    }

    public async Task<List<Player>> GetAllAsync()
    {
        return await _playersRepository.GetAllAsync();
    }
}
