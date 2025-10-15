using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Models;

public class Sale
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? CustomerId { get; set; }

    public Guid UserId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Range(0, double.MaxValue)]
    public decimal TotalAmount { get; set; }

    public Customer? Customer { get; set; }
    public User? User { get; set; }
    public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
}

