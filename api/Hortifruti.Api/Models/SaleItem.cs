using System.ComponentModel.DataAnnotations.Schema;

namespace Hortifruti.Api.Models;

public class SaleItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SaleId { get; set; }

    public Guid ProductId { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }

    public Sale? Sale { get; set; }
    public Product? Product { get; set; }
}

