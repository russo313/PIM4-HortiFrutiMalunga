using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hortifruti.Api.Models;

public enum SaleType
{
    Unit = 1,
    Weight = 2
}

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, StringLength(160)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    public SaleType SaleType { get; set; } = SaleType.Unit;

    [Required, StringLength(10)]
    public string UnitOfMeasure { get; set; } = "un";

    public DateOnly? ExpirationDate { get; set; }

    [StringLength(50)]
    public string? Barcode { get; set; }

    public bool Active { get; set; } = true;

    [Column(TypeName = "decimal(18,3)")]
    public decimal? MinimumStock { get; set; }

    public Category? Category { get; set; }
}
