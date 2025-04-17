using System.ComponentModel.DataAnnotations;

namespace QLNhaHang.API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? FullName { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? LastLogin { get; set; }

        public bool IsActive { get; set; } = true;

        public string Role { get; set; } = "User"; // Admin, User, etc.
    }
} 