using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Core.Entities;

public class Village
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int GameId { get; set; }
    public string Name { get; set; } = string.Empty!;
    public required Player Owner { get; set; }
    public required int OwnerGameId { get; set; }
    public required Coordinates Coordinates { get; set; }
    public required TroopCounts Troops { get; set; } = new();
    public required TroopCounts ForeignTroops { get; set; } = new();
    public Risk Risk { get; set; } = Risk.Low;
    public int Loyalty { get; set; } = 100;
    public int WallLevel { get; set; }
    public List<Command> Incomings { get; set; } = new();
    public List<Command> Commands { get; set; } = new();
    public List<OldCommand> OldIncomings { get; set; } = new();
    public List<OldCommand> OldCommands { get; set; } = new();
    public string CoordinatesText => $"{Coordinates.X}|{Coordinates.Y}";

    public Village()
    {
    }

    [SetsRequiredMembers]
    public Village(int gameId, string name, Player owner, Coordinates coordinates, int loyalty, int wallLevel)
    {
        GameId = gameId;
        Name = name;
        Owner = owner;
        Coordinates = coordinates;
        WallLevel = wallLevel;
        Loyalty = loyalty;
    }

    [SetsRequiredMembers]
    public Village(int gameId, string name, Player owner, Coordinates coordinates)
    {
        GameId = gameId;
        Name = name;
        Owner = owner;
        Coordinates = coordinates;
    }
}
