using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Core.DTOs.Incomings;
using Core.Entities;

namespace Application.Services;

public class IncomingsService : IIncomingsService
{
    private readonly IIncomingsRepository _incomingsRepository;

    public IncomingsService(IIncomingsRepository incomingsRepository)
    {
        _incomingsRepository = incomingsRepository;
    }

    public async Task DeleteOldCommandsAsync()
    {
        await _incomingsRepository.DeleteOldCommandsAsync();
    }

    public async Task GetPlayerIncomingsAsync(int playerId)
    {
        await _incomingsRepository.GetPlayerIncomingsAsync(playerId);
    }

    public async Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId)
    {
        return await _incomingsRepository.GetTribeIncomingsAsync(tribeId);
    }

    public async Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId, int page, int pageSize, string searchTerm)
    {
        return await _incomingsRepository.GetTribeIncomingsAsync(tribeId, page, pageSize, searchTerm);
    }

    public async Task UpdatePlayerIncomingsAsync(UpdateIncomingsRequestDTO dto)
    {
        await _incomingsRepository.UpdatePlayerIncomingsAsync(dto);
    }
}
