using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLNhaHang.API.Models;
using QLNhaHang.API.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QLNhaHang.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // Thêm endpoint để kiểm tra kết nối
        [HttpGet("test")]
        public IActionResult TestConnection()
        {
            return Ok(new { message = "API hoạt động bình thường" });
        }

        // Hỗ trợ preflight CORS
        [HttpOptions]
        [HttpOptions("login")]
        [HttpOptions("register")]
        [HttpOptions("create-admin")]
        public IActionResult Options()
        {
            return Ok();
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Dữ liệu không hợp lệ"
                });
            }

            var result = await _authService.Register(registerDto.Username, registerDto.Email, registerDto.Password);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // POST: api/Auth/create-admin
        [HttpPost("create-admin")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<ActionResult<AuthResponseDTO>> CreateAdmin(RegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Dữ liệu không hợp lệ"
                });
            }

            // In ra thông tin xác thực để debug
            Console.WriteLine($"User authenticated: {User.Identity?.IsAuthenticated}");
            Console.WriteLine($"User has admin role: {User.IsInRole(RoleConstants.Admin)}");
            if (User.Identity?.IsAuthenticated == true)
            {
                Console.WriteLine("Claims: " + string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}")));
            }

            var result = await _authService.CreateAdminAccount(registerDto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // Endpoint khẩn cấp để tạo admin mà không cần xác thực
        // Lưu ý: Chỉ sử dụng trong môi trường phát triển và xóa trước khi triển khai
        [HttpPost("emergency-create-admin")]
        public async Task<ActionResult<AuthResponseDTO>> EmergencyCreateAdmin(RegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Dữ liệu không hợp lệ"
                });
            }
            
            var result = await _authService.CreateAdminAccount(registerDto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Dữ liệu không hợp lệ"
                });
            }

            var result = await _authService.Login(loginDto.Username, loginDto.Password);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // GET: api/Auth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest(new { success = false, message = "Không tìm thấy thông tin người dùng." });
            }

            // TODO: Thêm phương thức GetUserById vào AuthService
            var user = await _authService.GetUserById(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy người dùng." });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    userId = user.UserId,
                    username = user.Username,
                    email = user.Email,
                    fullName = user.FullName,
                    phoneNumber = user.PhoneNumber,
                    role = user.Role,
                    isActive = user.IsActive,
                    createdAt = user.CreatedAt,
                    lastLogin = user.LastLogin
                }
            });
        }
    }
} 