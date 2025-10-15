namespace Hortifruti.Api.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "Hortifruti.Api";
    public string Audience { get; set; } = "Hortifruti.Clients";
    public string SecretKey { get; set; } = "alter-me-em-producao";
    public int ExpirationMinutes { get; set; } = 60;
}
