using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Models;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Description { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
