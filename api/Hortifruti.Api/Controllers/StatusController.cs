using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            name = "Hortifruti Malunga API",
            version = typeof(StatusController).Assembly.GetName().Version?.ToString() ?? "1.0.0",
            time = DateTimeOffset.UtcNow
        });
    }
}
