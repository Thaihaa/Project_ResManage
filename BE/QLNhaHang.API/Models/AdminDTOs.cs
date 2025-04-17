using System.ComponentModel.DataAnnotations;

namespace QLNhaHang.API.Models
{
    public class UserRoleUpdateDTO
    {
        [Required]
        public string NewRole { get; set; } = string.Empty;
    }

    public class UserStatusUpdateDTO
    {
        [Required]
        public bool IsActive { get; set; }
    }

    public class DashboardSummaryDTO
    {
        public int TotalRestaurants { get; set; }
        public int TotalTables { get; set; }
        public int TotalUsers { get; set; }
        public int TotalReservations { get; set; }
        public int PendingReservations { get; set; }
        public int ConfirmedReservations { get; set; }
        public int CancelledReservations { get; set; }
        public int CompletedReservations { get; set; }
    }
} 