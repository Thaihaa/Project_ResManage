using System.ComponentModel.DataAnnotations;

namespace QLNhaHang.API.Models
{
    public class Restaurant
    {
        [Key]
        public int RestaurantId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        
        [MaxLength(255)]
        public string? Image { get; set; }
        
        public double Rating { get; set; } = 0;
        
        [MaxLength(10)]
        public string OpenTime { get; set; } = "08:00";
        
        [MaxLength(10)]
        public string CloseTime { get; set; } = "22:00";
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public ICollection<Table> Tables { get; set; } = new List<Table>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
} 