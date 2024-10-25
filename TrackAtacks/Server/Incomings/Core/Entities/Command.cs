using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Core.Entities;

public class Command
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int? GameId { get; set; }
    public required Village OriginVillage { get; set; }
    public required Village DestinyVillage { get; set; }
    public DateTime LandTime { get; set; }
    public TwUnit? SlowestUnit { get; set; }
    public int Strength { get; set; }
    public Risk Risk { get; set; }

    [SetsRequiredMembers]
    public Command(Village originVillage, Village destinyVillage, DateTime landTime, TwUnit? slowestUnit = null, int? id = null, int strength = 0, Risk risk = Risk.Low)
    {
        GameId = id;
        OriginVillage = originVillage;
        DestinyVillage = destinyVillage;
        LandTime = landTime;
        SlowestUnit = slowestUnit ?? TwUnit.Ram;
        Strength = strength;
        Risk = risk;
    }
    public Command()
    {
    }
    public override string ToString()
    {
        return $"OriginVillage: {OriginVillage.Name}, DestinyVillage: {DestinyVillage.Name}, OriginPlayer: {OriginVillage.Owner.Name}, DestinyPlayer: {DestinyVillage.Owner.Name}, LandTime: {LandTime}, SlowestUnit: {SlowestUnit?.ToString() ?? "null"}";
    }
}
