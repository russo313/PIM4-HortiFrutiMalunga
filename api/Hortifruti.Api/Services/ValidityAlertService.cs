using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Services;

public class ValidityAlertService(HortifrutiContext context)
{
    public async Task<List<ValidityAlertResponse>> GetUpcomingAsync(int days, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var limit = today.AddDays(days);

        var products = await context.Products
            .AsNoTracking()
            .Where(p => p.ExpirationDate != null && p.ExpirationDate.Value >= today && p.ExpirationDate.Value <= limit)
            .Select(p => new ValidityAlertResponse(
                Guid.Empty,
                p.Id,
                p.Name,
                p.ExpirationDate!.Value,
                (p.ExpirationDate.Value.DayNumber - today.DayNumber),
                "preview",
                DateTime.UtcNow))
            .ToListAsync(ct);

        return products;
    }

    public async Task GenerateAsync(int days, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var limit = today.AddDays(days);

        var products = await context.Products
            .Where(p => p.ExpirationDate != null && p.ExpirationDate.Value >= today && p.ExpirationDate.Value <= limit)
            .ToListAsync(ct);

        foreach (var product in products)
        {
            var daysRemaining = product.ExpirationDate!.Value.DayNumber - today.DayNumber;
            var alert = await context.ValidityAlerts
                .FirstOrDefaultAsync(a => a.ProductId == product.Id && a.ValidUntil == product.ExpirationDate.Value, ct);

            if (alert is null)
            {
                context.ValidityAlerts.Add(new ValidityAlert
                {
                    ProductId = product.Id,
                    ValidUntil = product.ExpirationDate.Value,
                    DaysRemaining = daysRemaining,
                    Status = AlertStatus.New
                });
            }
            else
            {
                alert.DaysRemaining = daysRemaining;
                alert.GeneratedAt = DateTime.UtcNow;
                if (alert.Status == AlertStatus.Read && daysRemaining >= 0)
                {
                    alert.Status = AlertStatus.New;
                }
            }
        }

        await context.SaveChangesAsync(ct);
    }

    public async Task<List<ValidityAlertResponse>> GetAlertsAsync(CancellationToken ct = default)
    {
        return await context.ValidityAlerts
            .Include(a => a.Product)
            .AsNoTracking()
            .OrderBy(a => a.DaysRemaining)
            .Select(a => new ValidityAlertResponse(
                a.Id,
                a.ProductId,
                a.Product != null ? a.Product.Name : string.Empty,
                a.ValidUntil,
                a.DaysRemaining,
                a.Status.ToString(),
                a.GeneratedAt))
            .ToListAsync(ct);
    }

    public async Task<bool> MarkAsReadAsync(Guid id, CancellationToken ct = default)
    {
        var alert = await context.ValidityAlerts.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (alert is null)
        {
            return false;
        }

        alert.Status = AlertStatus.Read;
        await context.SaveChangesAsync(ct);
        return true;
    }
}

