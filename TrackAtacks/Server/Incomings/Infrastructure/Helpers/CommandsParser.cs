using Core.Entities;
using System.Text.RegularExpressions;

namespace Infrastructure.Helpers
{
    public static class CommandsParser
    {
        //public static List<Command> ParseCommands(this string text)
        //{
        //    var commands = new List<Command>();

        //    string[] lines = text.Trim().Split('\n', StringSplitOptions.RemoveEmptyEntries);

        //    foreach (string line in lines.Select(line => line.Trim()))
        //    {
        //        if (line.StartsWith("Ataque"))
        //        {
        //            var values = line.Split("\\t");
        //            var dateTime = values[5].ParseDateString();
        //            commands.Add(new(values[2].ParseCoords(), values[1].ParseCoords(), values[3].Trim(), values[3].Trim(), dateTime, null, null));
        //        }
        //    }

        //    return commands;
        //}

        public static string ParseCoords(this string text)
        {
            string pattern = @"(\d{3}\|\d{3})";
            Match match = Regex.Match(text, pattern);
            if (match.Success) return match.Groups[0].Value;

            return string.Empty;
        }
    }
}