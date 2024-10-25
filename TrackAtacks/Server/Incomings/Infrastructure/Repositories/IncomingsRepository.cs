using Application.Interfaces.Repositories;
using Core.DTOs.Incomings;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class IncomingsRepository : IIncomingsRepository
{
    private readonly AppDbContext _context;

    public IncomingsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task DeleteOldCommandsAsync()
    {
        var commands = _context.Commands.Where(c => c.LandTime <= DateTime.Now);

        if (commands.Any())
        {
            var oldCommands = commands.Select(c => new OldCommand(c, null));
            await _context.OldCommands.AddRangeAsync(oldCommands);

            _context.Commands.RemoveRange(commands);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Command>> GetPlayerIncomingsAsync(int playerId)
    {
        var player = await _context.Players.FindAsync(playerId);

        if (player is null) throw new Exception($"Player id:{playerId} not found");

        return player.Villages.SelectMany(v => v.Incomings).ToList();
    }

    public async Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId)
    {
        var commands = _context.Commands.AsSplitQuery().Where(c => c.DestinyVillage.Owner.TribeId == tribeId)
            .Include(c => c.OriginVillage)
            .Include(c => c.DestinyVillage)
            .Include(c => c.DestinyVillage.Owner)
            .Include(c => c.OriginVillage.Owner).Select(c => new CommandsViewDTO(
                    c.LandTime,
                    c.OriginVillage.Owner.Name,
                    $"{c.OriginVillage.Coordinates.X}|{c.OriginVillage.Coordinates.Y}",
                    c.DestinyVillage.Owner.Name,
                    $"{c.DestinyVillage.Coordinates.X}|{c.DestinyVillage.Coordinates.Y}"
                ));

        var res = new CommandsFilteredDTO(await commands.ToListAsync(), commands.Count());

        return res;
    }

    public async Task<CommandsFilteredDTO> GetTribeIncomingsAsync(int tribeId, int page, int pageSize, string searchTerm = "")
    {
        var commands = _context.Commands.Where(c => c.DestinyVillage.Owner.TribeId == tribeId);

        if (!string.IsNullOrEmpty(searchTerm))
        {
            commands = commands.AsSplitQuery().Where(c =>
            c.DestinyVillage.Coordinates.X.ToString().Contains(searchTerm) ||
            c.DestinyVillage.Coordinates.Y.ToString().Contains(searchTerm) ||
            c.OriginVillage.Coordinates.X.ToString().Contains(searchTerm) ||
            c.OriginVillage.Coordinates.Y.ToString().Contains(searchTerm) ||
            c.DestinyVillage.Owner.Name.Contains(searchTerm) ||
            c.OriginVillage.Owner.Name.Contains(searchTerm));
        }

        var filteredCommands = commands.AsSplitQuery().Include(c => c.OriginVillage)
           .Include(c => c.DestinyVillage)
           .Include(c => c.DestinyVillage.Owner)
           .Include(c => c.OriginVillage.Owner);

        var totalItems = filteredCommands.Count();

        var commadsDto = filteredCommands.Select(c => new CommandsViewDTO(
            c.LandTime,
            c.OriginVillage.Owner.Name,
            $"{c.OriginVillage.Coordinates.X}|{c.OriginVillage.Coordinates.Y}",
            c.DestinyVillage.Owner.Name,
            $"{c.DestinyVillage.Coordinates.X}|{c.DestinyVillage.Coordinates.Y}"
        ));

        var res = new CommandsFilteredDTO(await commadsDto.Skip(page * pageSize).Take(pageSize).ToListAsync(), totalItems);

        return res;
    }

    public Task<List<OldCommand>> GetVillageCommandsHistory(Village village)
    {
        var commands = _context.OldCommands.Where(oc => oc.OriginVillage == village);
        return commands.ToListAsync();
    }

    public async Task UpdatePlayerIncomingsAsync(UpdateIncomingsRequestDTO dto)
    {
        var destinyPlayer = await _context.Players.FirstOrDefaultAsync(p => p.GameId == dto.PlayerId);

        if (destinyPlayer is null)
        {
            destinyPlayer = new Player(dto.PlayerId, dto.TribeId, dto.PlayerName);
            await _context.Players.AddAsync(destinyPlayer);
            await _context.SaveChangesAsync();
        }

        var commands = new List<Command>();

        foreach (var incoming in dto.Incomings)
        {
            var originPlayer = await _context.Players.Include(p => p.Villages).FirstOrDefaultAsync(p => p.GameId == incoming.OriginPlayerId);
            var originVillage = originPlayer?.Villages.FirstOrDefault(v => v.GameId == incoming.OriginVillageId);

            var destinyVillage = destinyPlayer.Villages.FirstOrDefault(v => v.GameId == incoming.DestinyVillageId);

            if (destinyVillage is null)
            {
                var coordX = int.Parse(incoming.DestinyVillage.Substring(incoming.DestinyVillage.Length - 12, 3));
                var coordY = int.Parse(incoming.DestinyVillage.Substring(incoming.DestinyVillage.Length - 8, 3));
                destinyVillage = new Village(incoming.DestinyVillageId, incoming.DestinyVillage, destinyPlayer, new Coordinates(coordX, coordY), incoming.Loyalty, incoming.WallLevel);
                await _context.Villages.AddAsync(destinyVillage);
            }

            if (originPlayer is null)
            {
                originPlayer = new Player(incoming.OriginPlayerId, incoming.OriginPlayerName);
                var coordX = int.Parse(incoming.OriginVillage.Substring(incoming.DestinyVillage.Length - 12, 3));
                var coordY = int.Parse(incoming.OriginVillage.Substring(incoming.DestinyVillage.Length - 8, 3));
                originVillage = new Village(incoming.OriginVillageId, incoming.OriginVillage, originPlayer, new Coordinates(coordX, coordY));
                await _context.Villages.AddAsync(originVillage);
                await _context.Players.AddAsync(originPlayer);
                await _context.SaveChangesAsync();
            }

            if (originVillage is null)
            {
                var coordX = int.Parse(incoming.OriginVillage.Substring(incoming.DestinyVillage.Length - 12, 3));
                var coordY = int.Parse(incoming.OriginVillage.Substring(incoming.DestinyVillage.Length - 8, 3));
                originVillage = new Village(incoming.OriginVillageId, incoming.OriginVillage, originPlayer, new Coordinates(coordX, coordY));
                await _context.Villages.AddAsync(originVillage);
                await _context.SaveChangesAsync();
            }

            var command = new Command(originVillage, destinyVillage, incoming.LandTime, null, incoming.GameId);
            commands.Add(command);
        }

        await _context.Commands.AddRangeAsync(commands);
        await _context.SaveChangesAsync();
    }
}
