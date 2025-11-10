using System.ComponentModel.DataAnnotations.Schema;

namespace Hortifruti.Api.Models;

public class StockMovement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }

    public MovementType Type { get; set; }

    public MovementReason Reason { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal Quantity { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }

    public Guid? ReferenceId { get; set; }

    public string? Note { get; set; }

    public Product? Product { get; set; }
}

