using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(HortifrutiContext context) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await context.Categories
            .AsNoTracking()
            .Select(c => new CategoryResponse(c.Id, c.Name, c.Description))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategoryResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var category = await context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(new CategoryResponse(category.Id, category.Name, category.Description));
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)}")]
    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> Create([FromBody] CategoryRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var category = new Category
        {
            Name = request.Name,
            Description = request.Description
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync(cancellationToken);

        var response = new CategoryResponse(category.Id, category.Name, category.Description);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, response);
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)}")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CategoryRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category is null)
        {
            return NotFound();
        }

        category.Name = request.Name;
        category.Description = request.Description;

        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)}")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var category = await context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category is null)
        {
            return NotFound();
        }

        if (category.Products.Any())
        {
            return BadRequest(new { message = "Nao e possivel excluir categorias com produtos vinculados." });
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

