namespace Hortifruti.Api.Contracts;

public record SalesReportRow(
    string Key,
    decimal TotalAmount,
    decimal TotalQuantity,
    int ItemsCount
);

