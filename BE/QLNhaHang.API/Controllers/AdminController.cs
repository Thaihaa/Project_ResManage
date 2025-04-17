using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Data;
using QLNhaHang.API.Models;
using QLNhaHang.API.Services;
using System.Threading.Tasks;

namespace QLNhaHang.API.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    [Authorize(Roles = RoleConstants.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;

        public AdminController(ApplicationDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // GET: api/admin/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.PhoneNumber,
                    u.CreatedAt,
                    u.LastLogin,
                    u.IsActive,
                    u.Role
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = users
            });
        }

        // GET: api/admin/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy người dùng."
                });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    user.UserId,
                    user.Username,
                    user.Email,
                    user.FullName,
                    user.PhoneNumber,
                    user.CreatedAt,
                    user.LastLogin,
                    user.IsActive,
                    user.Role
                }
            });
        }

        // POST: api/admin/users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState
                });
            }

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Tên đăng nhập đã tồn tại."
                });
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Email đã tồn tại."
                });
            }

            var result = await _authService.RegisterUser(
                request.Username,
                request.Email,
                request.Password,
                request.FullName,
                request.PhoneNumber,
                request.Role,
                request.IsActive
            );

            if (!result.IsSuccess)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            var newUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            return CreatedAtAction(nameof(GetUser), new { id = newUser.UserId }, new
            {
                success = true,
                message = "Đã tạo người dùng mới thành công.",
                data = new
                {
                    newUser.UserId,
                    newUser.Username,
                    newUser.Email,
                    newUser.FullName,
                    newUser.PhoneNumber,
                    newUser.CreatedAt,
                    newUser.LastLogin,
                    newUser.IsActive,
                    newUser.Role
                }
            });
        }

        // PUT: api/admin/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState
                });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy người dùng."
                });
            }

            // Không cho phép cập nhật thông tin admin mặc định
            if (id == 1 && user.Role == RoleConstants.Admin)
            {
                if (request.Role != RoleConstants.Admin || !request.IsActive)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Không thể thay đổi quyền hoặc vô hiệu hóa tài khoản admin mặc định."
                    });
                }
            }

            // Kiểm tra email mới có trùng với email người dùng khác không
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email == request.Email && u.UserId != id))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Email đã được sử dụng bởi người dùng khác."
                    });
                }
                user.Email = request.Email;
            }

            // Cập nhật thông tin người dùng
            if (!string.IsNullOrEmpty(request.FullName))
                user.FullName = request.FullName;

            if (!string.IsNullOrEmpty(request.PhoneNumber))
                user.PhoneNumber = request.PhoneNumber;

            if (!string.IsNullOrEmpty(request.Role))
            {
                // Kiểm tra role hợp lệ
                if (request.Role != RoleConstants.Admin && 
                    request.Role != RoleConstants.User && 
                    request.Role != RoleConstants.Staff)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Vai trò không hợp lệ."
                    });
                }
                user.Role = request.Role;
            }

            user.IsActive = request.IsActive;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    message = "Cập nhật thông tin người dùng thành công.",
                    data = new
                    {
                        user.UserId,
                        user.Username,
                        user.Email,
                        user.FullName,
                        user.PhoneNumber,
                        user.CreatedAt,
                        user.LastLogin,
                        user.IsActive,
                        user.Role
                    }
                });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi khi cập nhật người dùng: {ex.Message}"
                });
            }
        }

        // PUT: api/admin/users/{id}/role
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UserRoleUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState
                });
            }

            var result = await _authService.ChangeUserRole(id, request.NewRole);

            if (!result.IsSuccess)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        // PUT: api/admin/users/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UserStatusUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState
                });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy người dùng."
                });
            }

            // Không cho phép khóa tài khoản admin có UserId = 1 (admin mặc định)
            if (id == 1 && user.Role == RoleConstants.Admin && !request.IsActive)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Không thể khóa tài khoản admin mặc định."
                });
            }

            user.IsActive = request.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = request.IsActive ? "Đã kích hoạt tài khoản người dùng." : "Đã khóa tài khoản người dùng."
            });
        }

        // DELETE: api/admin/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy người dùng."
                });
            }

            // Không cho phép xóa tài khoản admin có UserId = 1 (admin mặc định)
            if (id == 1 && user.Role == RoleConstants.Admin)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Không thể xóa tài khoản admin mặc định."
                });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Đã xóa người dùng thành công."
            });
        }
    }

    /// <summary>
    /// DTO cho tạo người dùng mới
    /// </summary>
    public class CreateUserDTO
    {
        /// <summary>
        /// Tên đăng nhập của người dùng
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Mật khẩu của người dùng
        /// </summary>
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Email của người dùng
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Họ tên đầy đủ của người dùng
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Số điện thoại của người dùng
        /// </summary>
        public string PhoneNumber { get; set; } = string.Empty;

        /// <summary>
        /// Vai trò của người dùng (Admin, User, Staff)
        /// </summary>
        public string Role { get; set; } = "User";

        /// <summary>
        /// Trạng thái hoạt động của người dùng
        /// </summary>
        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// DTO cho cập nhật thông tin người dùng
    /// </summary>
    public class UpdateUserDTO
    {
        /// <summary>
        /// Email của người dùng
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Họ tên đầy đủ của người dùng
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Số điện thoại của người dùng
        /// </summary>
        public string PhoneNumber { get; set; } = string.Empty;

        /// <summary>
        /// Vai trò của người dùng (Admin, User, Staff)
        /// </summary>
        public string Role { get; set; } = "User";

        /// <summary>
        /// Trạng thái hoạt động của người dùng
        /// </summary>
        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// DTO cho cập nhật vai trò người dùng
    /// </summary>
    public class UserRoleUpdateDTO
    {
        /// <summary>
        /// Vai trò mới cho người dùng (Admin, User, Staff)
        /// </summary>
        public string NewRole { get; set; } = "User";
    }

    /// <summary>
    /// DTO cho cập nhật trạng thái người dùng
    /// </summary>
    public class UserStatusUpdateDTO
    {
        /// <summary>
        /// Trạng thái hoạt động của người dùng
        /// </summary>
        public bool IsActive { get; set; }
    }
} 