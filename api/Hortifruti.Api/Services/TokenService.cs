using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Hortifruti.Api.Models;
using Hortifruti.Api.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Hortifruti.Api.Services;

public class TokenService(IOptions<JwtOptions> jwtOptions)
{
    private readonly JwtOptions _settings = jwtOptions.Value;

    public string GenerateToken(User user)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_settings.SecretKey);
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Name)
            }),
            Expires = DateTime.UtcNow.AddMinutes(_settings.ExpirationMinutes),
            Audience = _settings.Audience,
            Issuer = _settings.Issuer,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };

        var token = handler.CreateToken(descriptor);
        return handler.WriteToken(token);
    }
}
