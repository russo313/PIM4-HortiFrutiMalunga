using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Models;

public class Customer
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [StringLength(30)]
    public string? Phone { get; set; }

    [EmailAddress, StringLength(150)]
    public string? Email { get; set; }

    public string[]? FavoriteProducts { get; set; }
}
