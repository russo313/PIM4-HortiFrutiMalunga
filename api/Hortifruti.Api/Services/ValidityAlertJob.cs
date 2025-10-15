using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Hortifruti.Api.Services;

public class ValidityAlertJob(ValidityAlertService service, ILogger<ValidityAlertJob> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Gera alertas imediatamente ao iniciar
        await SafeGenerateAsync(stoppingToken);

        var timer = new PeriodicTimer(TimeSpan.FromHours(24));
        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await SafeGenerateAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            // ignorar cancelamento
        }
    }

    private async Task SafeGenerateAsync(CancellationToken ct)
    {
        try
        {
            await service.GenerateAsync(7, ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Falha ao gerar alertas de validade");
        }
    }
}


