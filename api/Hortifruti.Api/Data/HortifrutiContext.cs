using Microsoft.EntityFrameworkCore;
using Hortifruti.Api.Models;

namespace Hortifruti.Api.Data;

public class HortifrutiContext(DbContextOptions<HortifrutiContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<User> Users => Set<User>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<ValidityAlert> ValidityAlerts => Set<ValidityAlert>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<SaleItem> SaleItems => Set<SaleItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name)
            .HasDatabaseName("IX_Product_Name");

        modelBuilder.Entity<Product>()
            .Property(p => p.Highlights)
            .HasColumnType("text[]");

        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Name)
            .HasDatabaseName("IX_Customer_Name");

        modelBuilder.Entity<Customer>()
            .Property(c => c.FavoriteProducts)
            .HasColumnType("text[]");

        modelBuilder.Entity<StockMovement>()
            .Property(m => m.Quantity)
            .HasPrecision(18, 3);

        modelBuilder.Entity<ValidityAlert>()
            .HasIndex(a => new { a.ProductId, a.ValidUntil })
            .IsUnique();

        modelBuilder.Entity<Sale>()
            .HasMany(s => s.Items)
            .WithOne(i => i.Sale)
            .HasForeignKey(i => i.SaleId);

        modelBuilder.Entity<SaleItem>()
            .HasOne(i => i.Product)
            .WithMany()
            .HasForeignKey(i => i.ProductId);
    }
}
