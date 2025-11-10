using Hortifruti.Api.Contracts;
using Hortifruti.Api.Data;
using Hortifruti.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController(HortifrutiContext context) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await context.Customers
            .AsNoTracking()
            .Select(c => new CustomerResponse(c.Id, c.Name, c.Phone, c.Email, c.FavoriteProducts))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CustomerResponse>> Get(Guid id, CancellationToken cancellationToken)
    {
        var customer = await context.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (customer is null)
        {
            return NotFound();
        }

        return Ok(new CustomerResponse(customer.Id, customer.Name, customer.Phone, customer.Email, customer.FavoriteProducts));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CustomerResponse>> Create([FromBody] CustomerRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var customer = new Customer
        {
            Name = request.Name,
            Phone = NormalizePhone(request.Phone),
            Email = NormalizeEmail(request.Email),
            FavoriteProducts = request.FavoriteProducts
        };

        context.Customers.Add(customer);
        await context.SaveChangesAsync(cancellationToken);

        var response = new CustomerResponse(customer.Id, customer.Name, customer.Phone, customer.Email, customer.FavoriteProducts);
        return CreatedAtAction(nameof(Get), new { id = customer.Id }, response);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CustomerRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var customer = await context.Customers.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (customer is null)
        {
            return NotFound();
        }

        customer.Name = request.Name;
        customer.Phone = NormalizePhone(request.Phone);
        customer.Email = NormalizeEmail(request.Email);
        customer.FavoriteProducts = request.FavoriteProducts;

        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Manager)}")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var customer = await context.Customers.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (customer is null)
        {
            return NotFound();
        }

        context.Customers.Remove(customer);
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static string? NormalizePhone(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
        {
            return null;
        }

        var digits = new string(phone.Where(char.IsDigit).ToArray());
        return digits;
    }

    private static string? NormalizeEmail(string? email)
    {
        return string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
    }
}
