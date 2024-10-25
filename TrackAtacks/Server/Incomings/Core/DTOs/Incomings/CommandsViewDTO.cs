namespace Core.DTOs.Incomings;

public record CommandsViewDTO(DateTime landTime, string originPlayer, string originVillage, string destinyPlayer, string destinyVillage)
{
}
