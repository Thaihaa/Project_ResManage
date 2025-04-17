using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QLNhaHang.API.Data;
using QLNhaHang.API.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace QLNhaHang.API.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Tạo tài khoản admin mặc định nếu chưa có
        public async Task EnsureAdminAccountCreated()
        {
            var adminExists = await _context.Users.AnyAsync(u => u.Role == RoleConstants.Admin);
            if (!adminExists)
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = HashPassword("123456"), // Mật khẩu đơn giản hơn để dễ test
                    FullName = "Administrator",
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    Role = RoleConstants.Admin
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();
            }
        }

        // Tạo tài khoản admin tùy chỉnh
        public async Task<AuthResponseDTO> CreateAdminAccount(RegisterDTO registerDto)
        {
            // Kiểm tra username đã tồn tại chưa
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                return new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Tên đăng nhập đã tồn tại"
                };
            }

            // Kiểm tra email đã tồn tại chưa
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Email đã tồn tại"
                };
            }

            // Tạo admin user mới
            var adminUser = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                FullName = registerDto.FullName,
                PhoneNumber = registerDto.PhoneNumber,
                CreatedAt = DateTime.Now,
                IsActive = true,
                Role = RoleConstants.Admin // Gán quyền Admin
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            // Tạo token
            var token = GenerateJwtToken(adminUser);

            return new AuthResponseDTO
            {
                IsSuccess = true,
                Message = "Tạo tài khoản Admin thành công",
                Token = token,
                Username = adminUser.Username,
                Email = adminUser.Email,
                Role = adminUser.Role
            };
        }

        // Đăng ký người dùng mới
        public async Task<ServiceResult> Register(string username, string email, string password)
        {
            try
            {
                // Kiểm tra xem username đã tồn tại chưa
                if (await _context.Users.AnyAsync(u => u.Username == username))
                {
                    return ServiceResult.Failure("Tên đăng nhập đã tồn tại.");
                }

                // Kiểm tra xem email đã tồn tại chưa
                if (await _context.Users.AnyAsync(u => u.Email == email))
                {
                    return ServiceResult.Failure("Email đã tồn tại.");
                }

                // Tạo người dùng mới
                var user = new User
                {
                    Username = username,
                    Email = email,
                    PasswordHash = HashPassword(password),
                    Role = RoleConstants.User,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                };

                // Thêm vào database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return ServiceResult.Success("Đăng ký thành công.");
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure($"Lỗi khi đăng ký: {ex.Message}");
            }
        }

        // Đăng ký người dùng mới bởi admin (với role và trạng thái tùy chọn)
        public async Task<ServiceResult> RegisterUser(
            string username, 
            string email, 
            string password, 
            string fullName = null, 
            string phoneNumber = null, 
            string role = RoleConstants.User, 
            bool isActive = true)
        {
            try
            {
                // Kiểm tra xem username đã tồn tại chưa
                if (await _context.Users.AnyAsync(u => u.Username == username))
                {
                    return ServiceResult.Failure("Tên đăng nhập đã tồn tại.");
                }

                // Kiểm tra xem email đã tồn tại chưa
                if (await _context.Users.AnyAsync(u => u.Email == email))
                {
                    return ServiceResult.Failure("Email đã tồn tại.");
                }

                // Kiểm tra role hợp lệ
                if (role != RoleConstants.Admin && role != RoleConstants.User && role != RoleConstants.Staff)
                {
                    role = RoleConstants.User; // Mặc định là User nếu không hợp lệ
                }

                // Tạo người dùng mới
                var user = new User
                {
                    Username = username,
                    Email = email,
                    PasswordHash = HashPassword(password),
                    FullName = fullName,
                    PhoneNumber = phoneNumber,
                    Role = role,
                    IsActive = isActive,
                    CreatedAt = DateTime.Now
                };

                // Thêm vào database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return ServiceResult.Success("Tạo người dùng thành công.");
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure($"Lỗi khi tạo người dùng: {ex.Message}");
            }
        }

        // Đăng nhập
        public async Task<LoginResult> Login(string username, string password)
        {
            try
            {
                // Tìm user theo username
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                if (user == null)
                {
                    return new LoginResult
                    {
                        IsSuccess = false,
                        Message = "Tên đăng nhập không tồn tại."
                    };
                }

                // Kiểm tra tài khoản đã bị vô hiệu hóa chưa
                if (!user.IsActive)
                {
                    return new LoginResult
                    {
                        IsSuccess = false,
                        Message = "Tài khoản đã bị vô hiệu hóa."
                    };
                }

                // Kiểm tra mật khẩu
                if (!VerifyPassword(password, user.PasswordHash))
                {
                    return new LoginResult
                    {
                        IsSuccess = false,
                        Message = "Mật khẩu không đúng."
                    };
                }

                // Cập nhật thời gian đăng nhập gần nhất
                user.LastLogin = DateTime.Now;
                await _context.SaveChangesAsync();

                // Tạo JWT token cho người dùng
                var token = GenerateJwtToken(user);

                return new LoginResult
                {
                    IsSuccess = true,
                    UserId = user.UserId,
                    Username = user.Username,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    Token = token,
                    Message = "Đăng nhập thành công."
                };
            }
            catch (Exception ex)
            {
                return new LoginResult
                {
                    IsSuccess = false,
                    Message = $"Lỗi khi đăng nhập: {ex.Message}"
                };
            }
        }

        // Thay đổi role của người dùng
        public async Task<ServiceResult> ChangeUserRole(int userId, string newRole)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return ServiceResult.Failure("Không tìm thấy người dùng.");
                }

                // Kiểm tra role hợp lệ
                if (newRole != RoleConstants.Admin && newRole != RoleConstants.User && newRole != RoleConstants.Staff)
                {
                    return ServiceResult.Failure("Role không hợp lệ.");
                }

                // Ngăn chặn việc thay đổi role của admin gốc có id=1
                if (userId == 1 && user.Role == RoleConstants.Admin && newRole != RoleConstants.Admin)
                {
                    return ServiceResult.Failure("Không thể thay đổi role của admin mặc định.");
                }

                user.Role = newRole;
                await _context.SaveChangesAsync();

                return ServiceResult.Success("Thay đổi role thành công.");
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure($"Lỗi khi thay đổi role: {ex.Message}");
            }
        }

        // Lấy thông tin người dùng theo ID
        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        // Tạo JWT token
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Hash mật khẩu
        private string HashPassword(string password)
        {
            // Sử dụng phương pháp hash đơn giản và nhất quán giữa các phiên bản .NET
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            byte[] hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        // Xác thực mật khẩu
        private bool VerifyPassword(string password, string storedHash)
        {
            try
            {
                byte[] hashBytes = Convert.FromBase64String(storedHash);
                
                byte[] salt = new byte[16];
                Array.Copy(hashBytes, 0, salt, 0, 16);
                
                using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
                byte[] hash = pbkdf2.GetBytes(32);
                
                for (int i = 0; i < 32; i++)
                {
                    if (hashBytes[i + 16] != hash[i])
                        return false;
                }
                
                return true;
            }
            catch
            {
                // Nếu định dạng hash cũ, thử cách cũ
                try 
                {
                    var parts = storedHash.Split(':');
                    if (parts.Length != 2)
                        return false;

                    var salt = Convert.FromBase64String(parts[0]);
                    var oldHash = Convert.FromBase64String(parts[1]);

                    using var hmac = new HMACSHA512(salt);
                    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

                    for (int i = 0; i < computedHash.Length; i++)
                    {
                        if (computedHash[i] != oldHash[i]) return false;
                    }

                    return true;
                }
                catch
                {
                    return false;
                }
            }
        }
    }

    public class ServiceResult
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }

        public static ServiceResult Success(string message = "Thành công.")
        {
            return new ServiceResult
            {
                IsSuccess = true,
                Message = message
            };
        }

        public static ServiceResult Failure(string message)
        {
            return new ServiceResult
            {
                IsSuccess = false,
                Message = message
            };
        }
    }

    public class LoginResult : ServiceResult
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
    }
} 