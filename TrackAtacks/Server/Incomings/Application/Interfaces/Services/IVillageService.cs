namespace Application.Interfaces.Services;

public interface IVillageService
{
    Task EvaluateVillageRisk(int villageId);
}
