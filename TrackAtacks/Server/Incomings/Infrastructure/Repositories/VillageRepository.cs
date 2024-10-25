using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class VillageRepository : IVillageRepository
{
    private readonly AppDbContext _context;

    public VillageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Risk> GetCurrentVillageRiskAsync(int villageId)
    {
        var village = await GetVillageByIdAsync(villageId);
        return village.Risk;
    }

    public async Task<Village> GetVillageByIdAsync(int villageId)
    {
        var village = _context.Villages.FindAsync(villageId);
        return await village;
    }

    public async Task<List<Command>> GetVillageCommandsAsync(int villageId)
    {
        var village = await GetVillageByIdAsync(villageId);
        var commands = village.Incomings.ToList();
        return commands;
    }

    public async Task UpdateVillageRisk(int villageId, Risk risk)
    {
        var village = await GetVillageByIdAsync(villageId);
        village.Risk = risk;
        await _context.SaveChangesAsync();
    }
}
