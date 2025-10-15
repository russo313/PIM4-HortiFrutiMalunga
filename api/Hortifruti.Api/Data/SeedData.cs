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
                    MinimumStock = 10
                },
                new()
                {
                    Name = "Banana Nanica",
                    Category = fruits,
                    SaleType = SaleType.Weight,
                    UnitOfMeasure = "kg",
                    MinimumStock = 5
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

        await context.SaveChangesAsync(cancellationToken);
    }
}
