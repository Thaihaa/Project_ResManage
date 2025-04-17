using System.ComponentModel.DataAnnotations;

namespace QLNhaHang.API.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(255)]
        public string? Description { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
} 