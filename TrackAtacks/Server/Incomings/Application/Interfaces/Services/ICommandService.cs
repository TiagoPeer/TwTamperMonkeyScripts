using Core.Entities;

namespace Application.Interfaces.Services;

public interface ICommandService
{
    Task<double> EvaluateCommands(List<Command> commands); 
}
