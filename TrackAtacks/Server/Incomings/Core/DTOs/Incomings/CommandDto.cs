using Core.Entities;

namespace Core.DTOs.Incomings;

public class CommandDto
{
    public int? GameId { get; set; }
    public required string OriginVillage { get; set; }
    public required string DestinyVillage { get; set; }
    public required int OriginPlayerId {get; set; }
    public required string OriginPlayerName {get; set; }
    public required int OriginVillageId { get; set; }
    public required int DestinyVillageId { get; set; }
    public int WallLevel { get; set; }
    public int Loyalty { get; set; }
    public DateTime LandTime { get; set; }
    public TwUnit? SlowestUnit { get; set; }
}
