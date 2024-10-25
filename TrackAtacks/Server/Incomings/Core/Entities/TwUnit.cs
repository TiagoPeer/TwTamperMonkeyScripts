using System;

namespace Core.Entities;

public class TwUnit
{
    public static readonly TwUnit Spearman = new("Lanceiro", 18);
    public static readonly TwUnit Sword = new("Espadachim", 22);
    public static readonly TwUnit Viking = new("Viking", 18);
    public static readonly TwUnit Spy = new("Esplorador", 9);
    public static readonly TwUnit Light = new("Leves", 10);
    public static readonly TwUnit Heavy = new("Pesada", 11);
    public static readonly TwUnit Ram = new("Ariete", 30);
    public static readonly TwUnit Catapult = new("Catapulta", 30);
    public static readonly TwUnit Knight = new("Paladino", 10);
    public static readonly TwUnit Nobleman = new("Nobre", 35);
    public string Name { get; set; }
    public int Speed { get; set; }

    private TwUnit(string name, int speed)
    {
        Name = name;
        Speed = speed;
    }

    public override string ToString()
    {
        return Name;
    }
}
