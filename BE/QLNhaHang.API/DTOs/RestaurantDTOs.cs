using System.ComponentModel.DataAnnotations;

namespace QLNhaHang.API.DTOs
{
    public class RestaurantCreateDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [StringLength(255)]
        public string? Image { get; set; }
        
        [StringLength(10)]
        public string OpenTime { get; set; } = "08:00";
        
        [StringLength(10)]
        public string CloseTime { get; set; } = "22:00";
        
        [StringLength(500)]
        public string? Description { get; set; }
    }
    
    public class RestaurantUpdateDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [StringLength(255)]
        public string? Image { get; set; }
        
        [StringLength(10)]
        public string OpenTime { get; set; } = "08:00";
        
        [StringLength(10)]
        public string CloseTime { get; set; } = "22:00";
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
    
    public class RestaurantResponseDTO
    {
        public int RestaurantId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Image { get; set; }
        public double Rating { get; set; }
        public string OpenTime { get; set; } = string.Empty;
        public string CloseTime { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
    
    public class RestaurantDetailResponseDTO : RestaurantResponseDTO
    {
        public List<TableResponseDTO> Tables { get; set; } = new List<TableResponseDTO>();
    }
    
    public class TableResponseDTO
    {
        public int TableId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public bool IsAvailable { get; set; }
    }
    
    public class TableCreateDTO
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [Range(1, 50)]
        public int Capacity { get; set; } = 4;
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        [Required]
        public int RestaurantId { get; set; }
    }
    
    public class TableUpdateDTO
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [Range(1, 50)]
        public int Capacity { get; set; } = 4;
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; } = true;
    }
} 