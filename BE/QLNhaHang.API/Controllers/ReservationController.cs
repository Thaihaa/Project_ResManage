using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Data;
using QLNhaHang.API.DTOs;
using QLNhaHang.API.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QLNhaHang.API.Controllers
{
    [Route("api/dat-ban")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/dat-ban
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetReservations()
        {
            // Kiểm tra quyền: Admin xem tất cả, User thường chỉ xem đặt bàn của mình
            var isAdmin = User.IsInRole(RoleConstants.Admin);
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            if (userIdClaim == null)
            {
                return BadRequest(new { success = false, message = "Không tìm thấy thông tin người dùng." });
            }

            int userId;
            if (!int.TryParse(userIdClaim.Value, out userId))
            {
                return BadRequest(new { success = false, message = "ID người dùng không hợp lệ." });
            }

            var query = _context.Reservations
                .Include(r => r.Restaurant)
                .Include(r => r.Table)
                .Include(r => r.User)
                .AsQueryable();

            // Nếu không phải admin, chỉ lấy đặt bàn của user hiện tại
            if (!isAdmin)
            {
                query = query.Where(r => r.UserId == userId);
            }

            var reservations = await query
                .Select(r => new
                {
                    r.ReservationId,
                    r.ReservationDate,
                    r.StartTime,
                    r.EndTime,
                    r.GuestCount,
                    r.ContactPhone,
                    r.Notes,
                    r.Status,
                    r.CreatedAt,
                    UserId = r.UserId,
                    UserName = r.User != null ? r.User.Username : string.Empty,
                    RestaurantId = r.RestaurantId,
                    RestaurantName = r.Restaurant != null ? r.Restaurant.Name : string.Empty,
                    TableId = r.TableId,
                    TableName = r.Table != null ? r.Table.Name : string.Empty
                })
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = reservations
            });
        }

        // GET: api/dat-ban/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Restaurant)
                .Include(r => r.Table)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReservationId == id);

            if (reservation == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy đặt bàn." });
            }

            // Kiểm tra quyền: chỉ admin hoặc người tạo đặt bàn mới được xem
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int currentUserId;
            bool isAdmin = User.IsInRole(RoleConstants.Admin);
            
            if (!isAdmin && 
                (userIdClaim == null || !int.TryParse(userIdClaim.Value, out currentUserId) || 
                reservation.UserId != currentUserId))
            {
                return Forbid();
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    reservation.ReservationId,
                    reservation.ReservationDate,
                    reservation.StartTime,
                    reservation.EndTime,
                    reservation.GuestCount,
                    reservation.ContactPhone,
                    reservation.Notes,
                    reservation.Status,
                    reservation.CreatedAt,
                    UserId = reservation.UserId,
                    UserName = reservation.User != null ? reservation.User.Username : string.Empty,
                    RestaurantId = reservation.RestaurantId,
                    RestaurantName = reservation.Restaurant != null ? reservation.Restaurant.Name : string.Empty,
                    TableId = reservation.TableId,
                    TableName = reservation.Table != null ? reservation.Table.Name : string.Empty
                }
            });
        }

        // POST: api/dat-ban
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReservation(ReservationCreateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            // Lấy ID người dùng từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest(new { success = false, message = "Không tìm thấy thông tin người dùng." });
            }

            // Kiểm tra nhà hàng có tồn tại không
            var restaurant = await _context.Restaurants.FindAsync(request.RestaurantId);
            if (restaurant == null)
            {
                return BadRequest(new { success = false, message = "Nhà hàng không tồn tại." });
            }

            // Kiểm tra bàn có tồn tại không
            var table = await _context.Tables.FindAsync(request.TableId);
            if (table == null)
            {
                return BadRequest(new { success = false, message = "Bàn không tồn tại." });
            }

            // Kiểm tra bàn có thuộc nhà hàng không
            if (table.RestaurantId != request.RestaurantId)
            {
                return BadRequest(new { success = false, message = "Bàn không thuộc nhà hàng này." });
            }

            // Kiểm tra bàn có đang trống không
            if (!table.IsAvailable)
            {
                return BadRequest(new { success = false, message = "Bàn đã được đặt." });
            }

            // Kiểm tra thời gian đặt bàn
            DateTime reservationDate;
            if (!DateTime.TryParse(request.ReservationDate, out reservationDate))
            {
                return BadRequest(new { success = false, message = "Ngày đặt bàn không hợp lệ." });
            }

            // Tạo đặt bàn mới
            var reservation = new Reservation
            {
                UserId = userId,
                RestaurantId = request.RestaurantId,
                TableId = request.TableId,
                ReservationDate = reservationDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                GuestCount = request.GuestCount,
                ContactPhone = request.ContactPhone,
                Notes = request.Notes,
                Status = "Chờ xác nhận",
                CreatedAt = DateTime.Now
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.ReservationId }, new
            {
                success = true,
                message = "Đặt bàn thành công. Vui lòng chờ xác nhận.",
                data = new
                {
                    reservation.ReservationId,
                    reservation.ReservationDate,
                    reservation.StartTime,
                    reservation.EndTime,
                    reservation.GuestCount,
                    reservation.Status
                }
            });
        }

        // PUT: api/dat-ban/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReservation(int id, ReservationUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy đặt bàn." });
            }

            // Kiểm tra quyền: chỉ admin hoặc người tạo đặt bàn mới được sửa
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int currentUserId;
            bool isAdmin = User.IsInRole(RoleConstants.Admin);
            
            if (!isAdmin && 
                (userIdClaim == null || !int.TryParse(userIdClaim.Value, out currentUserId) || 
                reservation.UserId != currentUserId))
            {
                return Forbid();
            }

            // Kiểm tra nếu đặt bàn đã được xử lý (không còn ở trạng thái chờ xác nhận)
            if (reservation.Status != "Chờ xác nhận" && !isAdmin)
            {
                return BadRequest(new { success = false, message = "Đặt bàn đã được xử lý, không thể chỉnh sửa." });
            }

            // Kiểm tra thời gian đặt bàn
            DateTime reservationDate;
            if (!DateTime.TryParse(request.ReservationDate, out reservationDate))
            {
                return BadRequest(new { success = false, message = "Ngày đặt bàn không hợp lệ." });
            }

            // Cập nhật thông tin đặt bàn
            reservation.ReservationDate = reservationDate;
            reservation.StartTime = request.StartTime;
            reservation.EndTime = request.EndTime;
            reservation.GuestCount = request.GuestCount;
            reservation.ContactPhone = request.ContactPhone;
            reservation.Notes = request.Notes;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật đặt bàn thành công"
            });
        }

        // PUT: api/dat-ban/{id}/status
        [HttpPut("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateReservationStatus(int id, ReservationStatusUpdateDTO request)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy đặt bàn." });
            }

            // Kiểm tra quyền: chỉ admin mới được thay đổi trạng thái, trừ khi là hủy đặt bàn
            var isAdmin = User.IsInRole(RoleConstants.Admin);
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int currentUserId;
            
            if (!isAdmin && 
                (request.Status != "Đã hủy" || 
                userIdClaim == null || 
                !int.TryParse(userIdClaim.Value, out currentUserId) || 
                reservation.UserId != currentUserId))
            {
                return Forbid();
            }

            // Cập nhật trạng thái
            reservation.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật trạng thái đặt bàn thành công"
            });
        }

        // DELETE: api/dat-ban/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy đặt bàn." });
            }

            // Kiểm tra quyền: chỉ admin hoặc người tạo đặt bàn mới được xóa
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int currentUserId;
            bool isAdmin = User.IsInRole(RoleConstants.Admin);
            
            if (!isAdmin && 
                (userIdClaim == null || !int.TryParse(userIdClaim.Value, out currentUserId) || 
                reservation.UserId != currentUserId))
            {
                return Forbid();
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Xóa đặt bàn thành công"
            });
        }
    }

    public class ReservationCreateDTO
    {
        public int RestaurantId { get; set; }
        public int TableId { get; set; }
        public string ReservationDate { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int GuestCount { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class ReservationUpdateDTO
    {
        public string ReservationDate { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int GuestCount { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class ReservationStatusUpdateDTO
    {
        public string Status { get; set; } = string.Empty;
    }
} 