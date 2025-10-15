using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Services;

public class StockService(HortifrutiContext context)
{
    public async Task<decimal> GetBalanceAsync(Guid productId, CancellationToken ct = default)
    {
        var totals = await context.StockMovements
            .Where(m => m.ProductId == productId)
            .GroupBy(m => m.Type)
            .Select(g => new { Type = g.Key, Qty = g.Sum(x => x.Quantity) })
            .ToListAsync(ct);

        decimal entries = totals.FirstOrDefault(t => t.Type == MovementType.Entry)?.Qty ?? 0m;
        decimal exits = totals.FirstOrDefault(t => t.Type == MovementType.Exit)?.Qty ?? 0m;
        decimal adjustments = totals.FirstOrDefault(t => t.Type == MovementType.Adjustment)?.Qty ?? 0m;
        return entries - exits + adjustments;
    }

    public async Task<(bool ok, string? error, StockMovement? movement)> ManualDecreaseAsync(Guid productId, decimal quantity, MovementReason reason, Guid userId, string? note, CancellationToken ct = default)
    {
        if (quantity <= 0) return (false, "Quantidade deve ser positiva.", null);

        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == productId, ct);
        if (product is null) return (false, "Produto nao encontrado.", null);
        if (product is null) return (false, "Produto nao encontrado.", null);
        if (product.SaleType == SaleType.Unit && quantity != Math.Truncate(quantity))
            return (false, "Para UNIDADE a quantidade deve ser inteira.", null);

        var balance = await GetBalanceAsync(productId, ct);
        if (balance < quantity)
            return (false, "Estoque insuficiente.", null);

        var movement = new StockMovement
        {
            ProductId = productId,
            Type = MovementType.Exit,
            Reason = reason,
            Quantity = quantity,
            UserId = userId,
            Note = note,
            Timestamp = DateTime.UtcNow
        };

        context.StockMovements.Add(movement);
        await context.SaveChangesAsync(ct);
        return (true, null, movement);
    }
}


