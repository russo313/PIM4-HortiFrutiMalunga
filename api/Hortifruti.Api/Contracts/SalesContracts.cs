using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Contracts;

public record SaleItemRequest(
    [property: Required] Guid ProductId,
    [property: Range(0.001, double.MaxValue)] decimal Quantity,
    [property: Range(0, double.MaxValue)] decimal UnitPrice
);

public record SaleRequest(
    Guid? CustomerId,
    List<SaleItemRequest> Items
);

public record SaleResponse(
    Guid Id,
    Guid? CustomerId,
    DateTime Date,
    decimal TotalAmount,
    IEnumerable<SaleResponseItem> Items
);

public record SaleResponseItem(
    Guid ProductId,
    string ProductName,
    decimal Quantity,
    decimal UnitPrice,
    decimal Subtotal
);

