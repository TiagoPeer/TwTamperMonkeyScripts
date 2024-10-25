using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Core.Entities;

namespace Application.Services;

public class CommandService : ICommandService
{

    private readonly IIncomingsRepository _incomingsRepository;

    public CommandService(IIncomingsRepository incomingsRepository)
    {
        _incomingsRepository = incomingsRepository;
    }

    public async Task<double> EvaluateCommands(List<Command> commands)
    {
        var riskSum = 0d;
        foreach (Command command in commands)
        {
            riskSum += await EvaluateCommand(command);
        }

        return riskSum / commands.Count;
    }

    public async Task<double> EvaluateCommand(Command command)
    {
        var commandHistory = await _incomingsRepository.GetVillageCommandsHistory(command.OriginVillage);
        var lastCommand = commandHistory.OrderByDescending(c => c.LandTime).FirstOrDefault();
        //var numberOfCommands = commandHistory.Count;
        //var lastCommandStrength = lastCommand != null ? lastCommand.Strength : 0;
        //var mediumStrength = Math.Ceiling((double)(commandHistory.Sum(c => c.Strength) / numberOfCommands));

        double scaledLastCommandStrength = (double)3 / 3; // Since strength ranges from 1 to 3
        double scaledAverageStrength = 1 / 3; // Since strength ranges from 1 to 3

        // Calculate the combined value based on the specified weights
        double combinedValue = (0.6 * scaledLastCommandStrength) + (0.4 * scaledAverageStrength);

        return command.Strength == 3 ? 1 : combinedValue;
    }
}
