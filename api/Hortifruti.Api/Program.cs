using System.Text;
using Hortifruti.Api.Data;
using Hortifruti.Api.Options;
using Hortifruti.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Host.UseSerilog((ctx, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(ctx.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console();
});

builder.Services.AddControllers();
builder.Services.AddScoped<StockService>();
builder.Services.AddScoped<SalesService>();
builder.Services.AddScoped<ReportService>();
builder.Services.AddScoped<ValidityAlertService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.AddSingleton<TokenService>();

builder.Services.AddDbContext<HortifrutiContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Postgres");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("Configure ConnectionStrings:Postgres no appsettings ou variavel de ambiente.");
    }

    options.UseNpgsql(connectionString);
});

builder.Services.AddHealthChecks()
    .AddDbContextCheck<HortifrutiContext>("database");

var jwtSettings = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:4200" };

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy
            .SetIsOriginAllowed(origin => CorsOriginMatches(origin, allowedOrigins))
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<HortifrutiContext>();
    await SeedData.InitializeAsync(context);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapHealthChecks("/health", new HealthCheckOptions());

app.Run();

static bool CorsOriginMatches(string? origin, string[] allowedOrigins)
{
    if (string.IsNullOrWhiteSpace(origin))
    {
        return false;
    }

    var normalizedOrigin = origin.TrimEnd('/');
    foreach (var allowed in allowedOrigins)
    {
        if (string.IsNullOrWhiteSpace(allowed))
        {
            continue;
        }

        var normalizedAllowed = allowed.TrimEnd('/');
        if (!normalizedAllowed.Contains('*', StringComparison.Ordinal))
        {
            if (string.Equals(normalizedOrigin, normalizedAllowed, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            continue;
        }

        if (!Uri.TryCreate(origin, UriKind.Absolute, out var originUri))
        {
            continue;
        }

        var schemeSeparatorIndex = normalizedAllowed.IndexOf("://", StringComparison.Ordinal);
        var patternHost = schemeSeparatorIndex >= 0
            ? normalizedAllowed[(schemeSeparatorIndex + 3)..]
            : normalizedAllowed;

        if (patternHost.StartsWith("*.", StringComparison.Ordinal))
        {
            var domain = patternHost[2..];
            if (originUri.Host.EndsWith(domain, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }
    }

    return false;
}







