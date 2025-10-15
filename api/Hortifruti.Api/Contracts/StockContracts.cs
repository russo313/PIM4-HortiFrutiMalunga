using System.ComponentModel.DataAnnotations;
using Hortifruti.Api.Models;

namespace Hortifruti.Api.Contracts;

public record ManualDecreaseRequest(
    [property: Required] Guid ProductId,
    [property: Range(0.001, double.MaxValue)] decimal Quantity,
    [property: Required] MovementReason Reason,
    string? Note
);

public record StockMovementResponse(
    Guid Id,
    Guid ProductId,
    string ProductName,
    MovementType Type,
    MovementReason Reason,
    decimal Quantity,
    DateTime Timestamp,
    Guid UserId,
    string? Note
);

