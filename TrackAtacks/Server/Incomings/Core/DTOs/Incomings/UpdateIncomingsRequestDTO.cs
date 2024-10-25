using Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.Incomings;

public class UpdateIncomingsRequestDTO
{
    [Required]
    public int PlayerId { get; init; }
    [Required]
    public string PlayerName { get; init; } = string.Empty;
    [Required]
    public int TribeId { get; init; }
    [Required]
    public List<CommandDto> Incomings { get; set; } = new();
    // public string ApiKey { get; set; }
}

public enum AtackStrenght
{
    Green, Brown, Red
}