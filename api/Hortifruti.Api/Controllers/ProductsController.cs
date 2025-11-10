using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(HortifrutiContext context) : ControllerBase
{
    private static readonly HashSet<string> AllowedUnits = new(["un", "kg", "g", "maco", "pct"], StringComparer.OrdinalIgnoreCase);

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var products = await context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .Select(p => new ProductResponse(
                p.Id,
                p.Name,
                p.CategoryId,
                p.Category != null ? p.Category.Name : string.Empty,
                p.SaleType.ToString(),
                p.UnitOfMeasure,
                p.ExpirationDate,
                p.Barcode,
                p.Active,
                p.MinimumStock,
                p.Highlights))
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var product = await context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (product is null)
        {
            return NotFound();
        }

        var categoryName = product.Category?.Name ?? string.Empty;
        return Ok(ToResponse(product, categoryName));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create([FromBody] ProductRequest request, CancellationToken cancellationToken)
    {
        var validationProblem = await ValidateProductAsync(request, null, cancellationToken);
        if (validationProblem is not null)
        {
            return validationProblem;
        }

        var product = new Product
        {
            Name = request.Name,
            CategoryId = request.CategoryId,
            SaleType = request.SaleType,
            UnitOfMeasure = request.UnitOfMeasure.ToLowerInvariant(),
            ExpirationDate = request.ExpirationDate,
            Barcode = NormalizeBarcode(request.Barcode),
            Active = request.Active,
            MinimumStock = request.MinimumStock,
            Highlights = request.Highlights
        };

        context.Products.Add(product);
        await context.SaveChangesAsync(cancellationToken);

        var category = await context.Categories.AsNoTracking().FirstAsync(c => c.Id == product.CategoryId, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ToResponse(product, category.Name));
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ProductRequest request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (product is null)
        {
            return NotFound();
        }

        var validationProblem = await ValidateProductAsync(request, product, cancellationToken);
        if (validationProblem is not null)
        {
            return validationProblem;
        }

        product.Name = request.Name;
        product.CategoryId = request.CategoryId;
        product.SaleType = request.SaleType;
        product.UnitOfMeasure = request.UnitOfMeasure.ToLowerInvariant();
        product.ExpirationDate = request.ExpirationDate;
        product.Barcode = NormalizeBarcode(request.Barcode);
        product.Active = request.Active;
        product.MinimumStock = request.MinimumStock;
        product.Highlights = request.Highlights;

        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)}")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (product is null)
        {
            return NotFound();
        }

        context.Products.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private ProductResponse ToResponse(Product product, string categoryName = "") =>
        new(product.Id, product.Name, product.CategoryId, categoryName, product.SaleType.ToString(),
            product.UnitOfMeasure, product.ExpirationDate, product.Barcode, product.Active, product.MinimumStock,
            product.Highlights);

    private async Task<ActionResult?> ValidateProductAsync(ProductRequest request, Product? current, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!AllowedUnits.Contains(request.UnitOfMeasure))
        {
            ModelState.AddModelError(nameof(request.UnitOfMeasure), "Unidade de medida invalida (use: un, kg, g, maco, pct).");
            return ValidationProblem(ModelState);
        }

        if (!Enum.IsDefined(typeof(SaleType), request.SaleType))
        {
            ModelState.AddModelError(nameof(request.SaleType), "Tipo de venda invalido.");
            return ValidationProblem(ModelState);
        }

        if (request.MinimumStock.HasValue && request.MinimumStock.Value < 0)
        {
            ModelState.AddModelError(nameof(request.MinimumStock), "Estoque minimo nao pode ser negativo.");
            return ValidationProblem(ModelState);
        }

        if (request.SaleType == SaleType.Unit && request.MinimumStock is { } min && min != Math.Truncate(min))
        {
            ModelState.AddModelError(nameof(request.MinimumStock), "Para itens de unidade o estoque minimo deve ser inteiro.");
            return ValidationProblem(ModelState);
        }

        var categoryExists = await context.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            ModelState.AddModelError(nameof(request.CategoryId), "Categoria nao encontrada.");
            return ValidationProblem(ModelState);
        }

        return null;
    }

    private static string? NormalizeBarcode(string? barcode)
    {
        if (string.IsNullOrWhiteSpace(barcode))
        {
            return null;
        }

        return new string(barcode.Where(char.IsDigit).ToArray());
    }
}


