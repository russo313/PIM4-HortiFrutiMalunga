using System.Globalization;
using System.Text;
using Hortifruti.Api.Contracts;
using Hortifruti.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController(ReportService reportService) : ControllerBase
{
    [Authorize]
    [HttpGet("sales")]
    public async Task<IActionResult> GetSalesReport(
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        [FromQuery] Guid? customerId,
        [FromQuery] string groupBy = "day",
        [FromQuery] string? format = null,
        CancellationToken ct = default)
    {
        var rows = await reportService.GetSalesReportAsync(from, to, customerId, groupBy, ct);

        if (string.Equals(format, "csv", StringComparison.OrdinalIgnoreCase))
        {
            var csv = reportService.GenerateCsv(rows);
            var fileName = $"relatorio-vendas-{DateTime.UtcNow:yyyyMMddHHmm}.csv";
            return File(Encoding.UTF8.GetBytes(csv), "text/csv", fileName);
        }

        if (string.Equals(format, "pdf", StringComparison.OrdinalIgnoreCase))
        {
            var pdf = reportService.GeneratePdf(rows, from, to, groupBy);
            var fileName = $"relatorio-vendas-{DateTime.UtcNow:yyyyMMddHHmm}.pdf";
            return File(pdf, "application/pdf", fileName);
        }

        return Ok(rows);
    }
}
