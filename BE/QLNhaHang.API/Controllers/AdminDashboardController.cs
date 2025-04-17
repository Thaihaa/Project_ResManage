using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Data;
using System.Linq;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace QLNhaHang.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = new DashboardSummaryDTO
            {
                TotalRestaurants = await _context.Restaurants.CountAsync(),
                TotalTables = await _context.Tables.CountAsync(),
                TotalUsers = await _context.Users.CountAsync(),
                TotalReservations = await _context.Reservations.CountAsync(),
                PendingReservations = await _context.Reservations.CountAsync(r => r.Status == "Chờ xác nhận"),
                ConfirmedReservations = await _context.Reservations.CountAsync(r => r.Status == "Đã xác nhận"),
                CancelledReservations = await _context.Reservations.CountAsync(r => r.Status == "Đã hủy"),
                CompletedReservations = await _context.Reservations.CountAsync(r => r.Status == "Hoàn thành")
            };

            return Ok(new
            {
                success = true,
                data = summary
            });
        }

        // GET: api/admin/statistics
        [HttpGet("statistics")]
        public async Task<IActionResult> GetReservationStatistics([FromQuery] int days = 7)
        {
            DateTime startDate = DateTime.Now.Date.AddDays(-days);
            
            // Lấy thống kê đặt bàn theo ngày
            var dailyReservations = await _context.Reservations
                .Where(r => r.CreatedAt >= startDate)
                .GroupBy(r => r.CreatedAt.Date)
                .Select(g => new DailyReservationDTO
                {
                    Date = g.Key,
                    TotalReservations = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToListAsync();
            
            // Lấy số lượng đặt bàn theo nhà hàng
            var restaurantReservations = await _context.Reservations
                .Where(r => r.CreatedAt >= startDate)
                .GroupBy(r => new { r.RestaurantId, Name = r.Restaurant != null ? r.Restaurant.Name : string.Empty })
                .Select(g => new RestaurantReservationCountDTO
                {
                    RestaurantId = g.Key.RestaurantId,
                    RestaurantName = g.Key.Name,
                    ReservationCount = g.Count()
                })
                .OrderByDescending(r => r.ReservationCount)
                .Take(5)
                .ToListAsync();

            var statistics = new ReservationStatisticsDTO
            {
                DailyReservations = dailyReservations,
                RestaurantReservations = restaurantReservations
            };

            return Ok(new
            {
                success = true,
                data = statistics
            });
        }

        // GET: api/admin/recent-activity
        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            // Lấy các đặt bàn gần đây
            var recentReservations = await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .OrderByDescending(r => r.CreatedAt)
                .Take(10)
                .Select(r => new RecentReservationDTO
                {
                    ReservationId = r.ReservationId,
                    UserName = r.User != null ? r.User.FullName ?? r.User.Username : "Khách vãng lai",
                    RestaurantName = r.Restaurant != null ? r.Restaurant.Name : string.Empty,
                    ReservationDate = r.ReservationDate,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            // Lấy người dùng đăng ký gần đây
            var recentUsers = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(10)
                .Select(u => new RecentUserDTO
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Email = u.Email ?? string.Empty,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin
                })
                .ToListAsync();

            var recentActivity = new RecentActivityDTO
            {
                RecentReservations = recentReservations,
                RecentUsers = recentUsers
            };

            return Ok(new
            {
                success = true,
                data = recentActivity
            });
        }

        // GET: api/admin/reservations
        [HttpGet("reservations")]
        public async Task<IActionResult> GetAllReservationsForAdmin([FromQuery] string? status = null, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Include(r => r.Table)
                .AsQueryable();

            // Lọc theo trạng thái nếu có
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(r => r.Status == status);
            }

            // Lọc theo ngày bắt đầu nếu có
            if (startDate.HasValue)
            {
                query = query.Where(r => r.ReservationDate >= startDate.Value.Date);
            }

            // Lọc theo ngày kết thúc nếu có
            if (endDate.HasValue)
            {
                query = query.Where(r => r.ReservationDate <= endDate.Value.Date);
            }

            var reservations = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReservationResponseDTO
                {
                    ReservationId = r.ReservationId,
                    ReservationDate = r.ReservationDate,
                    StartTime = r.StartTime.ToString(),
                    EndTime = r.EndTime.ToString(),
                    GuestCount = r.GuestCount,
                    ContactPhone = r.ContactPhone ?? string.Empty,
                    Notes = r.Notes ?? string.Empty,
                    Status = r.Status ?? "Không xác định",
                    CreatedAt = r.CreatedAt,
                    UserId = r.UserId,
                    UserName = r.User != null ? r.User.FullName ?? r.User.Username : "Không xác định",
                    RestaurantId = r.RestaurantId,
                    RestaurantName = r.Restaurant != null ? r.Restaurant.Name : string.Empty,
                    TableId = r.TableId,
                    TableName = r.Table != null ? r.Table.Name : string.Empty
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = reservations
            });
        }

        // GET: api/admin/users-list
        [HttpGet("users-list")]
        public async Task<IActionResult> GetAllUsers([FromQuery] string? role = null, [FromQuery] bool? isActive = null)
        {
            var query = _context.Users.AsQueryable();

            // Lọc theo vai trò nếu có
            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(u => u.Role == role);
            }

            // Lọc theo trạng thái hoạt động nếu có
            if (isActive.HasValue)
            {
                query = query.Where(u => u.IsActive == isActive.Value);
            }

            var users = await query
                .OrderBy(u => u.Username)
                .Select(u => new UserResponseDTO
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Email = u.Email ?? string.Empty,
                    FullName = u.FullName ?? string.Empty,
                    PhoneNumber = u.PhoneNumber ?? string.Empty,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin,
                    IsActive = u.IsActive,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = users
            });
        }
    }

    /// <summary>
    /// DTO cho tổng quan dashboard
    /// </summary>
    public class DashboardSummaryDTO
    {
        /// <summary>
        /// Tổng số nhà hàng
        /// </summary>
        public int TotalRestaurants { get; set; }
        
        /// <summary>
        /// Tổng số bàn
        /// </summary>
        public int TotalTables { get; set; }
        
        /// <summary>
        /// Tổng số người dùng
        /// </summary>
        public int TotalUsers { get; set; }
        
        /// <summary>
        /// Tổng số đặt bàn
        /// </summary>
        public int TotalReservations { get; set; }
        
        /// <summary>
        /// Số đặt bàn đang chờ xác nhận
        /// </summary>
        public int PendingReservations { get; set; }
        
        /// <summary>
        /// Số đặt bàn đã xác nhận
        /// </summary>
        public int ConfirmedReservations { get; set; }
        
        /// <summary>
        /// Số đặt bàn đã hủy
        /// </summary>
        public int CancelledReservations { get; set; }
        
        /// <summary>
        /// Số đặt bàn đã hoàn thành
        /// </summary>
        public int CompletedReservations { get; set; }
    }

    /// <summary>
    /// DTO cho thống kê đặt bàn theo ngày
    /// </summary>
    public class DailyReservationDTO
    {
        /// <summary>
        /// Ngày thống kê
        /// </summary>
        public DateTime Date { get; set; }
        
        /// <summary>
        /// Tổng số đặt bàn trong ngày
        /// </summary>
        public int TotalReservations { get; set; }
    }

    /// <summary>
    /// DTO cho thống kê đặt bàn theo nhà hàng
    /// </summary>
    public class RestaurantReservationCountDTO
    {
        /// <summary>
        /// ID nhà hàng
        /// </summary>
        public int RestaurantId { get; set; }
        
        /// <summary>
        /// Tên nhà hàng
        /// </summary>
        public string RestaurantName { get; set; } = string.Empty;
        
        /// <summary>
        /// Số lượng đặt bàn
        /// </summary>
        public int ReservationCount { get; set; }
    }

    /// <summary>
    /// DTO cho thống kê đặt bàn
    /// </summary>
    public class ReservationStatisticsDTO
    {
        /// <summary>
        /// Thống kê đặt bàn theo ngày
        /// </summary>
        public List<DailyReservationDTO> DailyReservations { get; set; } = new();
        
        /// <summary>
        /// Thống kê đặt bàn theo nhà hàng
        /// </summary>
        public List<RestaurantReservationCountDTO> RestaurantReservations { get; set; } = new();
    }

    /// <summary>
    /// DTO cho thông tin đặt bàn gần đây
    /// </summary>
    public class RecentReservationDTO
    {
        /// <summary>
        /// ID đặt bàn
        /// </summary>
        public int ReservationId { get; set; }
        
        /// <summary>
        /// Tên người đặt
        /// </summary>
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// Tên nhà hàng
        /// </summary>
        public string RestaurantName { get; set; } = string.Empty;
        
        /// <summary>
        /// Ngày đặt bàn
        /// </summary>
        public DateTime ReservationDate { get; set; }
        
        /// <summary>
        /// Trạng thái đặt bàn
        /// </summary>
        public string Status { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời gian tạo đặt bàn
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO cho thông tin người dùng gần đây
    /// </summary>
    public class RecentUserDTO
    {
        /// <summary>
        /// ID người dùng
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// Tên đăng nhập
        /// </summary>
        public string Username { get; set; } = string.Empty;
        
        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời gian tạo tài khoản
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Thời gian đăng nhập gần nhất
        /// </summary>
        public DateTime? LastLogin { get; set; }
    }

    /// <summary>
    /// DTO cho hoạt động gần đây
    /// </summary>
    public class RecentActivityDTO
    {
        /// <summary>
        /// Danh sách đặt bàn gần đây
        /// </summary>
        public List<RecentReservationDTO> RecentReservations { get; set; } = new();
        
        /// <summary>
        /// Danh sách người dùng gần đây
        /// </summary>
        public List<RecentUserDTO> RecentUsers { get; set; } = new();
    }

    /// <summary>
    /// DTO cho thông tin đặt bàn chi tiết
    /// </summary>
    public class ReservationResponseDTO
    {
        /// <summary>
        /// ID đặt bàn
        /// </summary>
        public int ReservationId { get; set; }
        
        /// <summary>
        /// Ngày đặt bàn
        /// </summary>
        public DateTime ReservationDate { get; set; }
        
        /// <summary>
        /// Thời gian bắt đầu
        /// </summary>
        public string StartTime { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời gian kết thúc
        /// </summary>
        public string EndTime { get; set; } = string.Empty;
        
        /// <summary>
        /// Số lượng khách
        /// </summary>
        public int GuestCount { get; set; }
        
        /// <summary>
        /// Số điện thoại liên hệ
        /// </summary>
        public string ContactPhone { get; set; } = string.Empty;
        
        /// <summary>
        /// Ghi chú
        /// </summary>
        public string Notes { get; set; } = string.Empty;
        
        /// <summary>
        /// Trạng thái đặt bàn
        /// </summary>
        public string Status { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời gian tạo đặt bàn
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// ID người dùng
        /// </summary>
        public int? UserId { get; set; }
        
        /// <summary>
        /// Tên người dùng
        /// </summary>
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// ID nhà hàng
        /// </summary>
        public int RestaurantId { get; set; }
        
        /// <summary>
        /// Tên nhà hàng
        /// </summary>
        public string RestaurantName { get; set; } = string.Empty;
        
        /// <summary>
        /// ID bàn
        /// </summary>
        public int? TableId { get; set; }
        
        /// <summary>
        /// Tên bàn
        /// </summary>
        public string TableName { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO cho thông tin người dùng
    /// </summary>
    public class UserResponseDTO
    {
        /// <summary>
        /// ID người dùng
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// Tên đăng nhập
        /// </summary>
        public string Username { get; set; } = string.Empty;
        
        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; } = string.Empty;
        
        /// <summary>
        /// Họ tên đầy đủ
        /// </summary>
        public string FullName { get; set; } = string.Empty;
        
        /// <summary>
        /// Số điện thoại
        /// </summary>
        public string PhoneNumber { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời gian tạo tài khoản
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Thời gian đăng nhập gần nhất
        /// </summary>
        public DateTime? LastLogin { get; set; }
        
        /// <summary>
        /// Trạng thái hoạt động
        /// </summary>
        public bool IsActive { get; set; }
        
        /// <summary>
        /// Vai trò
        /// </summary>
        public string Role { get; set; } = string.Empty;
    }
} 