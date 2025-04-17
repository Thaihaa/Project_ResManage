using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Models;

namespace QLNhaHang.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Đăng ký các DbSet ở đây
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Cấu hình quan hệ và chỉ mục ở đây
            // Category
            modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
            
            // User
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            
            // Restaurant
            modelBuilder.Entity<Restaurant>().HasIndex(r => r.Name);
            
            // Table
            modelBuilder.Entity<Table>()
                .HasOne(t => t.Restaurant)
                .WithMany(r => r.Tables)
                .HasForeignKey(t => t.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Reservation
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);
                
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Restaurant)
                .WithMany(r => r.Reservations)
                .HasForeignKey(r => r.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Table)
                .WithMany(t => t.Reservations)
                .HasForeignKey(r => r.TableId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 