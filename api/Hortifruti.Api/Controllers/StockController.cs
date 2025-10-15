using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Hortifruti.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController(HortifrutiContext context, StockService stock) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("movements")]
    public async Task<ActionResult<IEnumerable<StockMovementResponse>>> GetMovements(
        [FromQuery] Guid? productId,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        [FromQuery] MovementReason? reason,
        CancellationToken ct)
    {
        var query = context.StockMovements
            .Include(m => m.Product)
            .AsNoTracking()
            .AsQueryable();

        if (productId.HasValue)
        {
            query = query.Where(m => m.ProductId == productId.Value);
        }

        if (reason.HasValue)
        {
            query = query.Where(m => m.Reason == reason.Value);
        }

        if (from.HasValue)
        {
            query = query.Where(m => m.Timestamp >= from.Value.ToDateTime(TimeOnly.MinValue));
        }

        if (to.HasValue)
        {
            query = query.Where(m => m.Timestamp <= to.Value.ToDateTime(TimeOnly.MaxValue));
        }

        var data = await query
            .OrderByDescending(m => m.Timestamp)
            .Select(m => new StockMovementResponse(
                m.Id,
                m.ProductId,
                m.Product != null ? m.Product.Name : string.Empty,
                m.Type,
                m.Reason,
                m.Quantity,
                m.Timestamp,
                m.UserId,
                m.Note))
            .ToListAsync(ct);

        return Ok(data);
    }

    [AllowAnonymous]
    [HttpGet("balance/{productId:guid}")]
    public async Task<IActionResult> GetBalance(Guid productId, CancellationToken ct)
    {
        var exists = await context.Products.AsNoTracking().AnyAsync(p => p.Id == productId, ct);
        if (!exists)
        {
            return NotFound();
        }

        var balance = await stock.GetBalanceAsync(productId, ct);
        return Ok(new { productId, balance });
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)},{nameof(UserRole.Stockist)}")]
    [HttpPost("manual-decrease")]
    public async Task<IActionResult> ManualDecrease([FromBody] ManualDecreaseRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Usuario nao identificado." });
        }

        var (ok, error, movement) = await stock.ManualDecreaseAsync(request.ProductId, request.Quantity, request.Reason, userId, request.Note, ct);

        if (!ok)
        {
            return StatusCode(422, new { message = error });
        }

        var productName = (await context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == request.ProductId, ct))?.Name ?? string.Empty;
        var response = new StockMovementResponse(
            movement!.Id,
            movement.ProductId,
            productName,
            movement.Type,
            movement.Reason,
            movement.Quantity,
            movement.Timestamp,
            movement.UserId,
            movement.Note);

        return Ok(response);
    }
}
