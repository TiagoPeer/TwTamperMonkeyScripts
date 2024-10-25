using Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Data.Common;

namespace Infrastructure.Data.Interceptors;

public class IncomingsUpdateInterceptor : DbCommandInterceptor
{
    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        if (IsInsertIncomingCommand(command))
        {
            Console.WriteLine();
        }

        return new ValueTask<InterceptionResult<DbDataReader>>(result);
    }
    private static bool IsInsertIncomingCommand(DbCommand command)
    {
        return command.CommandText.Trim().StartsWith("INSERT INTO [Commands]", StringComparison.OrdinalIgnoreCase);
    }
}
