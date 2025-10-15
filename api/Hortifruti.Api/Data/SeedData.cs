using Hortifruti.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(HortifrutiContext context, CancellationToken cancellationToken = default)
    {
        await context.Database.EnsureCreatedAsync(cancellationToken);

        if (!await context.Categories.AnyAsync(cancellationToken))
        {
            var greens = new Category { Name = "Hortalicas", Description = "Folhas e verduras" };
            var fruits = new Category { Name = "Frutas", Description = "Frutas selecionadas" };

            var products = new List<Product>
            {
                new()
                {
                    Name = "Alface Crespa",
                    Category = greens,
                    SaleType = SaleType.Unit,
                    UnitOfMeasure = "un",
                    MinimumStock = 10,
                    ExpirationDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5))
                },
                new()
                {
                    Name = "Banana Nanica",
                    Category = fruits,
                    SaleType = SaleType.Weight,
                    UnitOfMeasure = "kg",
                    MinimumStock = 5,
                    ExpirationDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
                }
            };

            context.Categories.AddRange(greens, fruits);
            context.Products.AddRange(products);
        }

        if (!await context.Users.AnyAsync(cancellationToken))
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            context.Users.Add(new User
            {
                Name = "Administrador",
                Email = "admin@hortifruti.local",
                PasswordHash = passwordHash,
                Role = UserRole.Admin
            });
        }

        if (!await context.Customers.AnyAsync(cancellationToken))
        {
            context.Customers.AddRange(
                new Customer { Name = "Maria Silva", Phone = "11999998888", Email = "maria@cliente.local" },
                new Customer { Name = "Jose Santos", Phone = "11911113333", Email = "jose@cliente.local" }
            );
        }

        await context.SaveChangesAsync(cancellationToken);

        if (!await context.StockMovements.AnyAsync(cancellationToken))
        {
            var userId = await context.Users.Select(u => u.Id).FirstAsync(cancellationToken);
            var productIds = await context.Products.Select(p => p.Id).ToListAsync(cancellationToken);

            foreach (var productId in productIds)
            {
                context.StockMovements.Add(new StockMovement
                {
                    ProductId = productId,
                    Type = MovementType.Entry,
                    Reason = MovementReason.Others,
                    Quantity = 50m,
                    UserId = userId,
                    Note = "Seed initial stock"
                });
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}

