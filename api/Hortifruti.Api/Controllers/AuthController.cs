using BCrypt.Net;
using Hortifruti.Api.Data;
using Hortifruti.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(HortifrutiContext context, TokenService tokenService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        var token = tokenService.GenerateToken(user);
        return Ok(new LoginResponse(user.Name, user.Role.ToString(), token));
    }
}

public record LoginRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Password);

public record LoginResponse(string Name, string Role, string Token);
