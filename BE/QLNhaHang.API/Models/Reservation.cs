using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLNhaHang.API.Models
{
    public class Reservation
    {
        [Key]
        public int ReservationId { get; set; }
        
        [Required]
        public DateTime ReservationDate { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(10)]
        public string EndTime { get; set; } = string.Empty;
        
        public int GuestCount { get; set; } = 1;
        
        [MaxLength(20)]
        public string? ContactPhone { get; set; }
        
        [MaxLength(500)]
        public string? Notes { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Chờ xác nhận"; // Chờ xác nhận, Đã xác nhận, Đã hủy, Hoàn thành
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Foreign keys
        public int? UserId { get; set; }
        
        public int RestaurantId { get; set; }
        
        public int TableId { get; set; }
        
        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }
        
        [ForeignKey("TableId")]
        public Table? Table { get; set; }
    }
} 