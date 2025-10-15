using Hortifruti.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(HortifrutiContext context) : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var products = await context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .Select(p => new
            {
                p.Id,
                p.Name,
                Category = p.Category != null ? p.Category.Name : string.Empty,
                SaleType = p.SaleType.ToString(),
                p.UnitOfMeasure,
                p.MinimumStock,
                p.Active
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }
}
