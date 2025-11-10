using System.ComponentModel.DataAnnotations;
using Hortifruti.Api.Models;

namespace Hortifruti.Api.Contracts;

public record ProductRequest(
    [Required, StringLength(160)] string Name,
    [Required] Guid CategoryId,
    [Required] SaleType SaleType,
    [Required, StringLength(10)] string UnitOfMeasure,
    DateOnly? ExpirationDate,
    [StringLength(50)] string? Barcode,
    bool Active,
    [Range(0, double.MaxValue)] decimal? MinimumStock,
    string[]? Highlights);

public record ProductResponse(
    Guid Id,
    string Name,
    Guid CategoryId,
    string CategoryName,
    string SaleType,
    string UnitOfMeasure,
    DateOnly? ExpirationDate,
    string? Barcode,
    bool Active,
    decimal? MinimumStock,
    string[]? Highlights);
