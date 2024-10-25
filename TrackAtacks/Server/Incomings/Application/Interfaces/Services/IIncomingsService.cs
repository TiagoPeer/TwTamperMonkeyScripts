using Core.DTOs.Incomings;
using Core.Entities;

namespace Application.Interfaces.Services;

public interface IIncomingsService
{
    Task GetPlayerIncomingsAsync(int playerId);
    Task UpdatePlayerIncomingsAsync(UpdateIncomingsRequestDTO dto);
    Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId);
    Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId, int page, int pageSize, string searchTerm);
    Task DeleteOldCommandsAsync();
}
