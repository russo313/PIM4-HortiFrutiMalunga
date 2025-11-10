using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Globalization;

namespace Hortifruti.Api.Services;

public class ReportService(HortifrutiContext context)
{
    public async Task<List<SalesReportRow>> GetSalesReportAsync(DateOnly? from, DateOnly? to, Guid? customerId, string groupBy, CancellationToken ct = default)
    {
        var query = context.Sales
            .Include(s => s.Items)
                .ThenInclude(i => i.Product)
            .AsNoTracking()
            .AsQueryable();

        if (from.HasValue)
        {
            var start = from.Value.ToDateTime(TimeOnly.MinValue);
            query = query.Where(s => s.Date >= start);
        }

        if (to.HasValue)
        {
            var end = to.Value.ToDateTime(TimeOnly.MaxValue);
            query = query.Where(s => s.Date <= end);
        }

        if (customerId.HasValue)
        {
            query = query.Where(s => s.CustomerId == customerId.Value);
        }

        var sales = await query.ToListAsync(ct);

        var items = sales.SelectMany(sale => sale.Items.Select(item => new
        {
            sale,
            item,
            Key = ResolveKey(groupBy, sale, item)
        }));

        var rows = items
            .GroupBy(x => x.Key)
            .Select(g => new SalesReportRow(
                g.Key,
                Math.Round(g.Sum(x => x.item.Subtotal), 2, MidpointRounding.ToEven),
                g.Sum(x => x.item.Quantity),
                g.Count()))
            .OrderByDescending(r => r.TotalAmount)
            .ToList();

        return rows;
    }

    private static string ResolveKey(string groupBy, Sale sale, SaleItem item)
    {
        return groupBy?.ToLowerInvariant() switch
        {
            "product" => item.Product?.Name ?? "Produto",
            "month" => sale.Date.ToString("yyyy-MM", CultureInfo.InvariantCulture),
            _ => sale.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
        };
    }

    public string GenerateCsv(IEnumerable<SalesReportRow> rows)
    {
        var lines = new List<string> { "Chave;Total;Quantidade;Itens" };
        lines.AddRange(rows.Select(r => $"{r.Key};{r.TotalAmount:F2};{r.TotalQuantity:F3};{r.ItemsCount}"));
        return string.Join("\r\n", lines);
    }

    public byte[] GeneratePdf(IEnumerable<SalesReportRow> rows, DateOnly? from, DateOnly? to, string groupBy)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var data = rows.ToList();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(36);
                page.Size(PageSizes.A4);
                page.PageColor(Colors.White);

                page.Header().Text("Relatorio de Vendas").SemiBold().FontSize(20);

                page.Content().Column(col =>
                {
                    col.Spacing(10);
                    col.Item().Text($"Periodo: {(from?.ToString("dd/MM/yyyy") ?? "inicio")} - {(to?.ToString("dd/MM/yyyy") ?? "atual")}");
                    col.Item().Text($"Agrupamento: {groupBy}");

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.ConstantColumn(90);
                            columns.ConstantColumn(90);
                            columns.ConstantColumn(60);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellHeader).Text("Chave");
                            header.Cell().Element(CellHeader).Text("Total");
                            header.Cell().Element(CellHeader).Text("Quantidade");
                            header.Cell().Element(CellHeader).Text("Itens");
                        });

                        foreach (var row in data)
                        {
                            table.Cell().Element(CellBody).Text(row.Key);
                            table.Cell().Element(CellBody).Text(row.TotalAmount.ToString("F2"));
                            table.Cell().Element(CellBody).Text(row.TotalQuantity.ToString("F3"));
                            table.Cell().Element(CellBody).Text(row.ItemsCount.ToString());
                        }
                    });
                });

                page.Footer().AlignRight().Text($"Gerado em {DateTime.UtcNow:dd/MM/yyyy HH:mm}");
            });
        });

        return document.GeneratePdf();
    }

    private static IContainer CellHeader(IContainer container) =>
        container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1);

    private static IContainer CellBody(IContainer container) =>
        container.PaddingVertical(4).BorderBottom(0.5f);
}
