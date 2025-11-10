using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Models;

public enum UserRole
{
    Admin = 1,
    Manager = 2,
    Stockist = 3,
    Cashier = 4
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; } = UserRole.Stockist;

    public bool Active { get; set; } = true;
}
