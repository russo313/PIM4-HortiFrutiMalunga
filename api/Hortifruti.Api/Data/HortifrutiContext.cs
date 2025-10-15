using Microsoft.EntityFrameworkCore;
using Hortifruti.Api.Models;

namespace Hortifruti.Api.Data;

public class HortifrutiContext(DbContextOptions<HortifrutiContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name)
            .HasDatabaseName("IX_Product_Name");

        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Name)
            .HasDatabaseName("IX_Customer_Name");
    }
}
