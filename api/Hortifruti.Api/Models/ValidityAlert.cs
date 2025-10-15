namespace Hortifruti.Api.Models;

public class ValidityAlert
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public DateOnly ValidUntil { get; set; }
    public int DaysRemaining { get; set; }
    public AlertStatus Status { get; set; } = AlertStatus.New;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public Product? Product { get; set; }
}

