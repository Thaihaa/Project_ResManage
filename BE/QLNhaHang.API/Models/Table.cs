using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLNhaHang.API.Models
{
    public class Table
    {
        [Key]
        public int TableId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        public int Capacity { get; set; } = 4;
        
        [MaxLength(100)]
        public string? Location { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        // Foreign key
        public int RestaurantId { get; set; }
        
        // Navigation property
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }
        
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
} 