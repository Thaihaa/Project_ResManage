namespace QLNhaHang.API.DTOs
{
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
    
    public class ReservationStatisticsDTO
    {
        public List<DailyReservationDTO> DailyReservations { get; set; } = new List<DailyReservationDTO>();
        public List<RestaurantReservationCountDTO> RestaurantReservations { get; set; } = new List<RestaurantReservationCountDTO>();
    }
    
    public class DailyReservationDTO
    {
        public DateTime Date { get; set; }
        public int TotalReservations { get; set; }
    }
    
    public class RestaurantReservationCountDTO
    {
        public int RestaurantId { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        public int ReservationCount { get; set; }
    }
    
    public class RecentActivityDTO
    {
        public List<RecentReservationDTO> RecentReservations { get; set; } = new List<RecentReservationDTO>();
        public List<RecentUserDTO> RecentUsers { get; set; } = new List<RecentUserDTO>();
    }
    
    public class RecentReservationDTO
    {
        public int ReservationId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
        public DateTime ReservationDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
    
    public class RecentUserDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
    }
} 