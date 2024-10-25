using System.Globalization;

namespace Infrastructure.Helpers;

public static class DateParser
{
    public static DateTime ParseDateString(this string dateString)
    {
        bool isTomorrow = dateString.Contains("amanhã");
        bool hasSpecificDate = dateString.Contains('a');

        DateTime currentDate = DateTime.Now.Date;

        if (isTomorrow)
        {
            currentDate = currentDate.AddDays(1);
        }

        string datePart = dateString[(dateString.IndexOf("às") + 3)..].Trim();
        string timePart = dateString[(dateString.IndexOf("às") + 3)..].Trim();

        DateTime targetDate = hasSpecificDate
            ? DateTime.ParseExact(datePart, "'a' dd.MM. 'às' HH:mm:ss:fff", CultureInfo.InvariantCulture)
            : currentDate;

        string combinedDateTime = targetDate.ToString("yyyy-MM-dd") + " " + timePart;

        DateTime parsedDateTime = DateTime.ParseExact(combinedDateTime, "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture);

        return parsedDateTime;
    }
}