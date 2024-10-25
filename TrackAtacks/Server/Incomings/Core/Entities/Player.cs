using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Core.Entities;

public class Player
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int GameId { get; set; }
    public int TribeId { get; set; }
    //public Tribe Tribe { get; set; }
    public required string Name { get; set; }
    public List<Village> Villages { get; set; } = new();
    //public List<Command> IncomingCommands { get; set; } = new();
    //public List<Command> SentCommands { get; set; } = new();

    [SetsRequiredMembers]
    public Player(int gameId, int tribeId, string name)
    {
        GameId = gameId;
        TribeId = tribeId;
        Name = name;
    }

    [SetsRequiredMembers]
    public Player(int gameId, string name)
    {
        GameId = gameId;
        Name = name;
    }
}
