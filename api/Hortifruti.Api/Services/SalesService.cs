using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Services;

public class SalesService(HortifrutiContext context, StockService stockService)
{
    public async Task<(bool ok, string? error, Sale? sale)> CreateAsync(SaleRequest request, Guid userId, CancellationToken ct = default)
    {
        if (request.Items is null || request.Items.Count == 0)
        {
            return (false, "Informe ao menos um item.", null);
        }

        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, ct);

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
            {
                return (false, "Produto nao encontrado.", null);
            }

            if (item.Quantity <= 0)
            {
                return (false, "Quantidade deve ser positiva.", null);
            }

            if (product.SaleType == SaleType.Unit && item.Quantity != Math.Truncate(item.Quantity))
            {
                return (false, $"Produto {product.Name} exige quantidade inteira.", null);
            }

            var balance = await stockService.GetBalanceAsync(product.Id, ct);
            if (balance < item.Quantity)
            {
                return (false, $"Estoque insuficiente para {product.Name}.", null);
            }
        }

        await using var transaction = await context.Database.BeginTransactionAsync(ct);

        var paymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod)
            ? "Dinheiro"
            : request.PaymentMethod!.Trim();

        var sale = new Sale
        {
            CustomerId = request.CustomerId,
            UserId = userId,
            Date = DateTime.UtcNow,
            PaymentMethod = paymentMethod
        };

        context.Sales.Add(sale);

        decimal total = 0m;

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];
            var subtotal = Math.Round(item.Quantity * item.UnitPrice, 2, MidpointRounding.ToEven);

            sale.Items.Add(new SaleItem
            {
                SaleId = sale.Id,
                ProductId = product.Id,
                Product = product,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = subtotal
            });

            total += subtotal;

            context.StockMovements.Add(new StockMovement
            {
                ProductId = product.Id,
                Type = MovementType.Exit,
                Reason = MovementReason.Sale,
                Quantity = item.Quantity,
                UserId = userId,
                ReferenceId = sale.Id,
                Note = "Venda"
            });
        }

        sale.TotalAmount = Math.Round(total, 2, MidpointRounding.ToEven);

        await context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return (true, null, sale);
    }

    public async Task<List<Sale>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Sales
            .Include(s => s.Customer)
            .Include(s => s.Items)
            .ThenInclude(i => i.Product)
            .AsNoTracking()
            .OrderByDescending(s => s.Date)
            .ToListAsync(ct);
    }

    public async Task<Sale?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Sales
            .Include(s => s.Customer)
            .Include(s => s.Items)
            .ThenInclude(i => i.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id, ct);
    }
}

