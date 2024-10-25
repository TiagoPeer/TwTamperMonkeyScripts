using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PlayersRepository : IPlayersRepository
{
    private readonly AppDbContext _context;

    public PlayersRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Player>> GetAllAsync()
    {
        return await _context.Players.ToListAsync();
    }
}
