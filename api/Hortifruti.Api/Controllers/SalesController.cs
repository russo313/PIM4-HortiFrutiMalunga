using Hortifruti.Api.Contracts;
using Hortifruti.Api.Models;
using Hortifruti.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController(SalesService service) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleResponse>>> GetAll(CancellationToken ct)
    {
        var sales = await service.GetAllAsync(ct);
        var response = sales.Select(MapToResponse);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SaleResponse>> GetById(Guid id, CancellationToken ct)
    {
        var sale = await service.GetByIdAsync(id, ct);
        if (sale is null)
        {
            return NotFound();
        }
        return Ok(MapToResponse(sale));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SaleRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Usuario nao identificado." });
        }

        var (ok, error, sale) = await service.CreateAsync(request, userId, ct);
        if (!ok || sale is null)
        {
            return StatusCode(422, new { message = error });
        }

        var response = MapToResponse(sale);
        return CreatedAtAction(nameof(GetById), new { id = sale.Id }, response);
    }

    private static SaleResponse MapToResponse(Sale sale)
    {
        return new SaleResponse(
            sale.Id,
            sale.CustomerId,
            sale.Customer?.Name,
            sale.Date,
            sale.TotalAmount,
            sale.PaymentMethod,
            sale.Items.Select(i => new SaleResponseItem(
                i.ProductId,
                i.Product?.Name ?? string.Empty,
                i.Quantity,
                i.UnitPrice,
                i.Subtotal
            )));
    }
}

