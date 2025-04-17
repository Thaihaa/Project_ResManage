using System.ComponentModel.DataAnnotations;

namespace QLNhaHang.API.DTOs
{
    public class ReservationCreateDTO
    {
        [Required]
        public int RestaurantId { get; set; }
        
        [Required]
        public int TableId { get; set; }
        
        [Required]
        public DateTime ReservationDate { get; set; }
        
        [Required]
        [StringLength(10)]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string EndTime { get; set; } = string.Empty;
        
        [Range(1, 50)]
        public int GuestCount { get; set; } = 1;
        
        [StringLength(20)]
        public string? ContactPhone { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }
    
    public class ReservationUpdateDTO
    {
        [Required]
        public int RestaurantId { get; set; }
        
        [Required]
        public int TableId { get; set; }
        
        [Required]
        public DateTime ReservationDate { get; set; }
        
        [Required]
        [StringLength(10)]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string EndTime { get; set; } = string.Empty;
        
        [Range(1, 50)]
        public int GuestCount { get; set; } = 1;
        
        [StringLength(20)]
        public string? ContactPhone { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }
    
    public class ReservationStatusUpdateDTO
    {
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty;
    }
    
    public class ReservationResponseDTO
    {
        public int ReservationId { get; set; }
        public DateTime ReservationDate { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int GuestCount { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        
        // User info
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        
        // Restaurant info
        public int RestaurantId { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        
        // Table info
        public int TableId { get; set; }
        public string TableName { get; set; } = string.Empty;
    }
} 