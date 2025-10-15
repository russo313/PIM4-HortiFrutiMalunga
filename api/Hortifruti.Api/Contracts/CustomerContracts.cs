using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Contracts;

public record CustomerRequest(
    [Required, StringLength(150)] string Name,
    [StringLength(30)] string? Phone,
    [EmailAddress, StringLength(150)] string? Email);

public record CustomerResponse(Guid Id, string Name, string? Phone, string? Email);
