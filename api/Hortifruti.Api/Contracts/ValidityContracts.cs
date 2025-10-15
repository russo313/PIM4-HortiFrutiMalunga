namespace Hortifruti.Api.Contracts;

public record ValidityAlertResponse(
    Guid Id,
    Guid ProductId,
    string ProductName,
    DateOnly ValidUntil,
    int DaysRemaining,
    string Status,
    DateTime GeneratedAt);

