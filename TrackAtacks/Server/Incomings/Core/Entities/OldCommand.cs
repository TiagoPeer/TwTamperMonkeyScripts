using System.Diagnostics.CodeAnalysis;

namespace Core.Entities;

public class OldCommand : Command
{
    public int? ReportId { get; set; }

    [SetsRequiredMembers]
    public OldCommand(Command sourceCommand, int? reportId = null)
    {
        GameId = sourceCommand.GameId;
        OriginVillage = sourceCommand.OriginVillage;
        DestinyVillage = sourceCommand.DestinyVillage;
        LandTime = sourceCommand.LandTime;
        SlowestUnit = sourceCommand.SlowestUnit;
        ReportId = reportId;
    }

    public OldCommand()
    {
    }
}
