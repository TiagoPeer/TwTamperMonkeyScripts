using Core.DTOs.Incomings;
using Core.Entities;

namespace Application.Interfaces.Repositories;

public interface IIncomingsRepository
{
    Task<List<Command>> GetPlayerIncomingsAsync(int playerId);
    Task UpdatePlayerIncomingsAsync(UpdateIncomingsRequestDTO dto);
    Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId);
    Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId, int page, int pageSize, string searchTerm);
    Task DeleteOldCommandsAsync();
    Task<List<OldCommand>> GetVillageCommandsHistory(Village village);
}
