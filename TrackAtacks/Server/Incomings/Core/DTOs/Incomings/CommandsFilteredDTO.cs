namespace Core.DTOs.Incomings;

public record CommandsFilteredDTO(List<CommandsViewDTO> Commands, int TotalItems)
{
}
