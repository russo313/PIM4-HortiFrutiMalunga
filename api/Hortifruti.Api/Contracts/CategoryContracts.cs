using System.ComponentModel.DataAnnotations;

namespace Hortifruti.Api.Contracts;

public record CategoryRequest(
    [Required, StringLength(120)] string Name,
    [StringLength(255)] string? Description);

public record CategoryResponse(Guid Id, string Name, string? Description);
