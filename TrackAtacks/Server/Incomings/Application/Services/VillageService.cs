using Application.Interfaces.Repositories;
using Application.Interfaces.Services;

namespace Application.Services;

public class VillageService : IVillageService
{
    private readonly IVillageRepository _villageRepository;
    private readonly ICommandService _commandService;

    public VillageService(IVillageRepository villageRepository, ICommandService commandService)
    {
        _villageRepository = villageRepository;
        _commandService = commandService;
    }

    public async Task EvaluateVillageRisk(int villageId)
    {
        var village = await _villageRepository.GetVillageByIdAsync(villageId);
        var commands = await _villageRepository.GetVillageCommandsAsync(villageId);

        //TODO Evaluate all current commands history and get the value fo risk
        var commandsRisk = await _commandService.EvaluateCommands(commands);

        //TODO Get the number of red incomings
        var redIncomings = 1;

        //TODO Evaluate the number of troops in village, wall level and buffs to compare with the risk and get the atual village risk
        var wallBonus = village.WallLevel / 20;

        var geralDefence = village.Troops.Spearman * 15;
        geralDefence += village.Troops.Sword * 45;
        geralDefence += village.Troops.Light * 30;
        geralDefence += village.Troops.Heavy * 200;

        var cavalaryDefence = village.Troops.Spearman * 45;
        cavalaryDefence += village.Troops.Sword * 25;
        cavalaryDefence += village.Troops.Light * 40;
        cavalaryDefence += village.Troops.Heavy * 80;

        var totalDefence = (geralDefence + cavalaryDefence) * (1 + wallBonus);

        var risk = Core.Entities.Risk.Low;

        if (commandsRisk > 0.6 && totalDefence < 2_000_000 * redIncomings)
        {
            await Console.Out.WriteLineAsync("risk high");
            risk = Core.Entities.Risk.High;
        }
        else if (commandsRisk > 0.4 && commandsRisk <= 0.6)
        {
            await Console.Out.WriteLineAsync("risk moderated");
            risk = Core.Entities.Risk.Moderated;
        }

        //TODO Save the result in database
        await _villageRepository.UpdateVillageRisk(villageId, risk);
    }
}
