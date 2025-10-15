using Hortifruti.Api.Models;
using Hortifruti.Api.Contracts;
using Hortifruti.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValidityController(ValidityAlertService service) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("next")]
    public async Task<ActionResult<IEnumerable<ValidityAlertResponse>>> GetNext([FromQuery] int days = 7, CancellationToken ct = default)
    {
        if (days <= 0) days = 7;
        var data = await service.GetUpcomingAsync(days, ct);
        return Ok(data);
    }

    [AllowAnonymous]
    [HttpGet("alerts")]
    public async Task<ActionResult<IEnumerable<ValidityAlertResponse>>> GetAlerts(CancellationToken ct = default)
    {
        var alerts = await service.GetAlertsAsync(ct);
        return Ok(alerts);
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)}")]
    [HttpPost("run")]
    public async Task<IActionResult> Run([FromQuery] int days = 7, CancellationToken ct = default)
    {
        if (days <= 0) days = 7;
        await service.GenerateAsync(days, ct);
        return NoContent();
    }

    [Authorize]
    [HttpPatch("alerts/{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken ct = default)
    {
        var ok = await service.MarkAsReadAsync(id, ct);
        if (!ok) return NotFound();
        return NoContent();
    }
}


