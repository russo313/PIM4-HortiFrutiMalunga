using System.Globalization;
using Hortifruti.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hortifruti.Api.Data;

public static class SeedData
{
    private static readonly CultureInfo Culture = CultureInfo.InvariantCulture;

    private record CategorySeed(string Name, string Description);
    private record ProductSeed(
        string Name,
        string CategoryName,
        SaleType SaleType,
        string UnitOfMeasure,
        decimal? MinimumStock,
        string? ExpirationDate,
        bool Active,
        string[]? Highlights);
    private record CustomerSeed(string Name, string? Phone, string? Email, string[]? FavoriteProducts);
    private record StockMovementSeed(string ProductName, MovementType Type, MovementReason Reason, decimal Quantity, string Timestamp, string Note);
    private record ValidityAlertSeed(string ProductName, string ValidUntil, int DaysRemaining, AlertStatus Status, string GeneratedAt);
    private record SaleSeed(string? CustomerName, string PaymentMethod, string Date, SaleItemSeed[] Items);
    private record SaleItemSeed(string ProductName, decimal Quantity, decimal UnitPrice);

    private static readonly CategorySeed[] CategorySeeds =
    [
        new("Hortalicas", "Folhas e verduras frescas"),
        new("Frutas Tropicais", "Sabores do clima quente"),
        new("Legumes", "Ingredientes para o dia a dia"),
        new("Ervas Aromaticas", "Toque especial para as receitas"),
        new("Organicos", "Producao sustentavel certificada"),
        new("Raizes e Tuberculos", "Energia natural da terra"),
        new("Cestas", "Selecoes prontas para consumo"),
        new("Graos e Cereais", "Acompanhamentos e farinhas"),
        new("Sucos Naturais", "Prensados a frio"),
        new("Itens Gourmet", "Produtos premium e diferenciados")
    ];

    private static readonly ProductSeed[] ProductSeeds =
    [
        new("Alface Crespa Hidroponica", "Hortalicas", SaleType.Unit, "un", 15m, "2025-10-18", true, ["Colhida diariamente", "Livre de agrotoxicos"]),
        new("Mix de Folhas Baby", "Hortalicas", SaleType.Weight, "g", 5m, "2025-10-16", true, ["Rucula, espinafre e agriao baby", "Ideal para saladas especiais"]),
        new("Banana Nanica Premium", "Frutas Tropicais", SaleType.Weight, "kg", 12m, null, true, ["Doces selecionadas", "Fornecedores parceiros"]),
        new("Manga Palmer", "Frutas Tropicais", SaleType.Unit, "un", 10m, null, true, ["Polpa avermelhada", "Baixa fibra"]),
        new("Tomate Italiano", "Legumes", SaleType.Weight, "kg", 8m, "2025-10-22", true, ["Ideal para molhos", "Menor acidez"]),
        new("Cenoura Baby", "Legumes", SaleType.Weight, "kg", 6m, "2025-10-25", true, ["Pronta para consumo", "Textura crocante"]),
        new("Manjericao Genoves", "Ervas Aromaticas", SaleType.Unit, "maco", null, "2025-10-14", true, ["Excelente para pesto", "Cultivo em estufa"]),
        new("Batata Doce Roxa", "Raizes e Tuberculos", SaleType.Weight, "kg", 10m, null, true, ["Baixo indice glicemico", "Fonte de betacaroteno"]),
        new("Cesta Detox Semanal", "Cestas", SaleType.Unit, "kit", null, null, true, ["Inclui sucos, sopas e snacks saudaveis", "Entrega programada"]),
        new("Farinha de Amendoas Premium", "Graos e Cereais", SaleType.Weight, "kg", null, null, true, ["Ideal para receitas low carb", "Embalagem a vacuo"])
    ];

    private static readonly CustomerSeed[] CustomerSeeds =
    [
        new("Maria Silva", "(11) 99999-8888", "maria@cliente.local", ["Alface Crespa Hidroponica", "Cesta Detox Semanal"]),
        new("Jose Santos", "(11) 91111-3333", "jose@cliente.local", ["Tomate Italiano"]),
        new("Ana Pereira", "(11) 93456-7890", "ana@cliente.local", ["Manga Palmer", "Farinha de Amendoas Premium"]),
        new("Claudia Ramos", "(11) 92222-4455", "claudia@cliente.local", null),
        new("Rafael Costa", "(11) 91212-3434", "rafael@cliente.local", null),
        new("Bianca Nunes", "(11) 98888-1212", "bianca@cliente.local", null),
        new("Lucas Freitas", "(11) 90001-9999", "lucas@cliente.local", null),
        new("Fernanda Alves", "(11) 97676-5656", "fernanda@cliente.local", null),
        new("Gustavo Lima", "(11) 95555-8888", "gustavo@cliente.local", null),
        new("Patricia Torres", "(11) 93333-0000", "patricia@cliente.local", null),
        new("Cliente Balcao", null, null, null)
    ];

    private static readonly StockMovementSeed[] StockMovementSeeds =
    [
        new("Alface Crespa Hidroponica", MovementType.Entry, MovementReason.Others, 30m, "2025-10-12T08:30:00-03:00", "Estoque inicial"),
        new("Mix de Folhas Baby", MovementType.Entry, MovementReason.Others, 12m, "2025-10-12T09:15:00-03:00", "Chegada do fornecedor VerdeVivo"),
        new("Banana Nanica Premium", MovementType.Entry, MovementReason.Others, 25m, "2025-10-11T07:45:00-03:00", "Lote Fazenda Primavera"),
        new("Tomate Italiano", MovementType.Exit, MovementReason.Sale, 6m, "2025-10-12T12:10:00-03:00", "Pedido VEN-1042"),
        new("Manjericao Genoves", MovementType.Exit, MovementReason.Donation, 8m, "2025-10-09T15:00:00-03:00", "Doacao ONG Sabor Solidario"),
        new("Batata Doce Roxa", MovementType.Entry, MovementReason.Others, 40m, "2025-10-10T10:25:00-03:00", "Parceria Sitio Flor do Campo"),
        new("Farinha de Amendoas Premium", MovementType.Entry, MovementReason.Others, 15m, "2025-10-08T16:40:00-03:00", "Lote importado"),
        new("Manga Palmer", MovementType.Exit, MovementReason.Sale, 9m, "2025-10-13T11:55:00-03:00", "Pedido VEN-1051"),
        new("Cenoura Baby", MovementType.Exit, MovementReason.Loss, 3m, "2025-10-07T18:20:00-03:00", "Avaria na embalagem"),
        new("Cesta Detox Semanal", MovementType.Entry, MovementReason.Others, 20m, "2025-10-11T14:00:00-03:00", "Montagem da semana")
    ];

    private static readonly ValidityAlertSeed[] ValiditySeeds =
    [
        new("Mix de Folhas Baby", "2025-10-16", 3, AlertStatus.New, "2025-10-13T06:00:00-03:00"),
        new("Manjericao Genoves", "2025-10-14", 1, AlertStatus.New, "2025-10-13T06:00:00-03:00"),
        new("Alface Crespa Hidroponica", "2025-10-18", 5, AlertStatus.Read, "2025-10-12T06:00:00-03:00"),
        new("Tomate Italiano", "2025-10-22", 9, AlertStatus.Read, "2025-10-13T06:00:00-03:00"),
        new("Manga Palmer", "2025-10-19", 6, AlertStatus.New, "2025-10-13T06:00:00-03:00")
    ];

    private static readonly SaleSeed[] SaleSeeds =
    [
        new("Maria Silva", "Cartao de credito", "2025-10-12T12:10:00-03:00",
            [new("Tomate Italiano", 2.5m, 14.9m), new("Alface Crespa Hidroponica", 3m, 6.9m), new("Cesta Detox Semanal", 1m, 70.45m)]),
        new("Jose Santos", "Pix", "2025-10-12T15:45:00-03:00",
            [new("Banana Nanica Premium", 3m, 9.5m), new("Manga Palmer", 3m, 7.95m)]),
        new("Ana Pereira", "Cartao de debito", "2025-10-11T11:30:00-03:00",
            [new("Farinha de Amendoas Premium", 1m, 39.9m), new("Cenoura Baby", 1.8m, 27.5m)]),
        new("Cliente Balcao", "Dinheiro", "2025-10-11T17:55:00-03:00",
            [new("Manjericao Genoves", 2m, 8.9m), new("Mix de Folhas Baby", 0.6m, 31.5m)]),
        new("Rafael Costa", "Pix", "2025-10-10T13:40:00-03:00",
            [new("Batata Doce Roxa", 3m, 11.9m), new("Tomate Italiano", 2m, 14.3m)]),
        new("Bianca Nunes", "Cartao de credito", "2025-10-09T18:15:00-03:00",
            [new("Cesta Detox Semanal", 1m, 70.45m), new("Alface Crespa Hidroponica", 4m, 6.9m), new("Banana Nanica Premium", 1.5m, 9.5m)]),
        new("Fernanda Alves", "Cartao de debito", "2025-10-09T09:20:00-03:00",
            [new("Cenoura Baby", 1.2m, 27.5m), new("Mix de Folhas Baby", 0.5m, 31.5m)]),
        new("Cliente Balcao", "Dinheiro", "2025-10-08T17:05:00-03:00",
            [new("Manjericao Genoves", 1m, 8.9m), new("Manga Palmer", 1.5m, 9.1m)]),
        new("Gustavo Lima", "Pix", "2025-10-08T10:50:00-03:00",
            [new("Banana Nanica Premium", 2.5m, 9.5m), new("Tomate Italiano", 3m, 14.3m), new("Farinha de Amendoas Premium", 0.7m, 39.9m)]),
        new("Claudia Ramos", "Cartao de credito", "2025-10-07T16:25:00-03:00",
            [new("Manga Palmer", 2.5m, 7.95m), new("Alface Crespa Hidroponica", 3m, 6.9m), new("Manjericao Genoves", 2m, 8.9m)])
    ];

    public static async Task InitializeAsync(HortifrutiContext context, CancellationToken ct = default)
    {
        await context.Database.MigrateAsync(ct);

        await EnsureCategoriesAsync(context, ct);
        await EnsureProductsAsync(context, ct);
        var adminUserId = await EnsureAdminUserAsync(context, ct);
        await EnsureCustomersAsync(context, ct);
        await EnsureSalesAsync(context, adminUserId, ct);
        await EnsureStockMovementsAsync(context, adminUserId, ct);
        await EnsureValidityAlertsAsync(context, ct);
    }

    private static async Task EnsureCategoriesAsync(HortifrutiContext context, CancellationToken ct)
    {
        if (await context.Categories.AnyAsync(ct))
        {
            return;
        }

        var categories = CategorySeeds.Select(seed => new Category
        {
            Name = seed.Name,
            Description = seed.Description
        });

        context.Categories.AddRange(categories);
        await context.SaveChangesAsync(ct);
    }

    private static async Task EnsureProductsAsync(HortifrutiContext context, CancellationToken ct)
    {
        if (await context.Products.AnyAsync(ct))
        {
            return;
        }

        var categories = await context.Categories.AsNoTracking()
            .ToDictionaryAsync(c => c.Name, c => c.Id, StringComparer.OrdinalIgnoreCase, ct);

        foreach (var seed in ProductSeeds)
        {
            if (!categories.TryGetValue(seed.CategoryName, out var categoryId))
            {
                continue;
            }

            context.Products.Add(new Product
            {
                Name = seed.Name,
                CategoryId = categoryId,
                SaleType = seed.SaleType,
                UnitOfMeasure = seed.UnitOfMeasure,
                ExpirationDate = ParseDateOnly(seed.ExpirationDate),
                Active = seed.Active,
                MinimumStock = seed.MinimumStock,
                Highlights = seed.Highlights
            });
        }

        await context.SaveChangesAsync(ct);
    }

    private static async Task<Guid> EnsureAdminUserAsync(HortifrutiContext context, CancellationToken ct)
    {
        var user = await context.Users.FirstOrDefaultAsync(ct);
        if (user is not null)
        {
            return user.Id;
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
        user = new User
        {
            Name = "Administrador",
            Email = "admin@hortifruti.local",
            PasswordHash = passwordHash,
            Role = UserRole.Admin
        };

        context.Users.Add(user);
        await context.SaveChangesAsync(ct);
        return user.Id;
    }

    private static async Task EnsureCustomersAsync(HortifrutiContext context, CancellationToken ct)
    {
        if (await context.Customers.AnyAsync(ct))
        {
            return;
        }

        var customers = CustomerSeeds.Select(seed => new Customer
        {
            Name = seed.Name,
            Phone = NormalizeDigits(seed.Phone),
            Email = NormalizeEmail(seed.Email),
            FavoriteProducts = seed.FavoriteProducts
        });

        context.Customers.AddRange(customers);
        await context.SaveChangesAsync(ct);
    }

    private static async Task EnsureSalesAsync(HortifrutiContext context, Guid userId, CancellationToken ct)
    {
        if (await context.Sales.AnyAsync(ct))
        {
            return;
        }

        var customers = await context.Customers.AsNoTracking()
            .ToDictionaryAsync(c => c.Name, c => c.Id, StringComparer.OrdinalIgnoreCase, ct);

        var products = await context.Products.AsNoTracking()
            .ToDictionaryAsync(p => p.Name, p => p.Id, StringComparer.OrdinalIgnoreCase, ct);

        foreach (var saleSeed in SaleSeeds)
        {
            Guid? customerId = null;
            if (!string.IsNullOrWhiteSpace(saleSeed.CustomerName) && customers.TryGetValue(saleSeed.CustomerName, out var existingCustomerId))
            {
                customerId = existingCustomerId;
            }

            var sale = new Sale
            {
                CustomerId = customerId,
                PaymentMethod = string.IsNullOrWhiteSpace(saleSeed.PaymentMethod) ? "Dinheiro" : saleSeed.PaymentMethod,
                UserId = userId,
                Date = ParseDateTime(saleSeed.Date)
            };

            decimal total = 0m;

            foreach (var itemSeed in saleSeed.Items)
            {
                if (!products.TryGetValue(itemSeed.ProductName, out var productId))
                {
                    continue;
                }

                var subtotal = Math.Round(itemSeed.Quantity * itemSeed.UnitPrice, 2, MidpointRounding.ToEven);

                sale.Items.Add(new SaleItem
                {
                    ProductId = productId,
                    Quantity = itemSeed.Quantity,
                    UnitPrice = itemSeed.UnitPrice,
                    Subtotal = subtotal
                });

                total += subtotal;
            }

            if (sale.Items.Count == 0)
            {
                continue;
            }

            sale.TotalAmount = Math.Round(total, 2, MidpointRounding.ToEven);
            context.Sales.Add(sale);
        }

        await context.SaveChangesAsync(ct);
    }

    private static async Task EnsureStockMovementsAsync(HortifrutiContext context, Guid userId, CancellationToken ct)
    {
        if (await context.StockMovements.AnyAsync(ct))
        {
            return;
        }

        var products = await context.Products.AsNoTracking()
            .ToDictionaryAsync(p => p.Name, p => p.Id, StringComparer.OrdinalIgnoreCase, ct);

        foreach (var seed in StockMovementSeeds)
        {
            if (!products.TryGetValue(seed.ProductName, out var productId))
            {
                continue;
            }

            context.StockMovements.Add(new StockMovement
            {
                ProductId = productId,
                Type = seed.Type,
                Reason = seed.Reason,
                Quantity = seed.Quantity,
                Timestamp = ParseDateTime(seed.Timestamp),
                UserId = userId,
                Note = seed.Note
            });
        }

        await context.SaveChangesAsync(ct);
    }

    private static async Task EnsureValidityAlertsAsync(HortifrutiContext context, CancellationToken ct)
    {
        if (await context.ValidityAlerts.AnyAsync(ct))
        {
            return;
        }

        var products = await context.Products.AsNoTracking()
            .ToDictionaryAsync(p => p.Name, p => p.Id, StringComparer.OrdinalIgnoreCase, ct);

        foreach (var seed in ValiditySeeds)
        {
            if (!products.TryGetValue(seed.ProductName, out var productId))
            {
                continue;
            }

            context.ValidityAlerts.Add(new ValidityAlert
            {
                ProductId = productId,
                ValidUntil = ParseDateOnly(seed.ValidUntil) ?? DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)),
                DaysRemaining = seed.DaysRemaining,
                Status = seed.Status,
                GeneratedAt = ParseDateTime(seed.GeneratedAt)
            });
        }

        await context.SaveChangesAsync(ct);
    }

    private static DateOnly? ParseDateOnly(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return DateOnly.Parse(value, Culture);
    }

    private static DateTime ParseDateTime(string value)
    {
        return DateTimeOffset.Parse(value, Culture, DateTimeStyles.AssumeUniversal).UtcDateTime;
    }

    private static string? NormalizeDigits(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return new string(value.Where(char.IsDigit).ToArray());
    }

    private static string? NormalizeEmail(string? email)
    {
        return string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
    }
}
