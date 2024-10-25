using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories;

public interface IVillageRepository
{
    Task<Risk> GetCurrentVillageRiskAsync(int villageId);
    Task<Village> GetVillageByIdAsync(int villageId);
    Task<List<Command>> GetVillageCommandsAsync(int villageId);
    Task UpdateVillageRisk(int villageId, Risk risk);
}
