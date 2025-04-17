using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Data;
using QLNhaHang.API.DTOs;
using QLNhaHang.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace QLNhaHang.API.Controllers
{
    [Route("api/nha-hang")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RestaurantController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/nha-hang
        [HttpGet]
        public async Task<IActionResult> GetAllRestaurants()
        {
            var restaurants = await _context.Restaurants
                .Where(r => r.IsActive)
                .Select(r => new RestaurantResponseDTO
                {
                    RestaurantId = r.RestaurantId,
                    Name = r.Name,
                    Address = r.Address,
                    PhoneNumber = r.PhoneNumber,
                    Image = r.Image,
                    Rating = r.Rating,
                    OpenTime = r.OpenTime,
                    CloseTime = r.CloseTime,
                    Description = r.Description,
                    IsActive = r.IsActive
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = restaurants
            });
        }

        // GET: api/nha-hang/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRestaurantById(int id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Tables.Where(t => t.IsAvailable))
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy nhà hàng." });
            }

            var response = new RestaurantDetailResponseDTO
            {
                RestaurantId = restaurant.RestaurantId,
                Name = restaurant.Name,
                Address = restaurant.Address,
                PhoneNumber = restaurant.PhoneNumber,
                Image = restaurant.Image,
                Rating = restaurant.Rating,
                OpenTime = restaurant.OpenTime,
                CloseTime = restaurant.CloseTime,
                Description = restaurant.Description,
                IsActive = restaurant.IsActive,
                Tables = restaurant.Tables.Select(t => new TableResponseDTO
                {
                    TableId = t.TableId,
                    Name = t.Name,
                    Capacity = t.Capacity,
                    Location = t.Location,
                    Description = t.Description,
                    IsAvailable = t.IsAvailable
                }).ToList()
            };

            return Ok(new
            {
                success = true,
                data = response
            });
        }

        // POST: api/nha-hang
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRestaurant([FromBody] RestaurantCreateDTO request)
        {
            var restaurant = new Restaurant
            {
                Name = request.Name,
                Address = request.Address,
                PhoneNumber = request.PhoneNumber,
                Image = request.Image,
                OpenTime = request.OpenTime,
                CloseTime = request.CloseTime,
                Description = request.Description,
                IsActive = true
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            var response = new RestaurantResponseDTO
            {
                RestaurantId = restaurant.RestaurantId,
                Name = restaurant.Name,
                Address = restaurant.Address,
                PhoneNumber = restaurant.PhoneNumber,
                Image = restaurant.Image,
                Rating = restaurant.Rating,
                OpenTime = restaurant.OpenTime,
                CloseTime = restaurant.CloseTime,
                Description = restaurant.Description,
                IsActive = restaurant.IsActive
            };

            return CreatedAtAction(nameof(GetRestaurantById), new { id = restaurant.RestaurantId }, new
            {
                success = true,
                message = "Tạo nhà hàng thành công",
                data = response
            });
        }

        // PUT: api/nha-hang/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRestaurant(int id, [FromBody] RestaurantUpdateDTO request)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy nhà hàng." });
            }

            restaurant.Name = request.Name;
            restaurant.Address = request.Address;
            restaurant.PhoneNumber = request.PhoneNumber;
            restaurant.Image = request.Image;
            restaurant.OpenTime = request.OpenTime;
            restaurant.CloseTime = request.CloseTime;
            restaurant.Description = request.Description;
            restaurant.IsActive = request.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật nhà hàng thành công"
            });
        }

        // DELETE: api/nha-hang/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy nhà hàng." });
            }

            // Kiểm tra xem nhà hàng có đơn đặt bàn nào không
            var hasReservations = await _context.Reservations
                .AnyAsync(r => r.RestaurantId == id && 
                          (r.Status == "Chờ xác nhận" || r.Status == "Đã xác nhận"));

            if (hasReservations)
            {
                // Thay vì xóa, đặt trạng thái không hoạt động
                restaurant.IsActive = false;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Nhà hàng đã được đặt trạng thái không hoạt động do có đơn đặt bàn."
                });
            }

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Xóa nhà hàng thành công"
            });
        }

        // POST: api/nha-hang/{restaurantId}/ban
        [HttpPost("{restaurantId}/ban")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateTable(int restaurantId, [FromBody] TableCreateDTO request)
        {
            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy nhà hàng." });
            }

            var table = new Table
            {
                Name = request.Name,
                Capacity = request.Capacity,
                Location = request.Location,
                Description = request.Description,
                IsAvailable = request.IsAvailable,
                RestaurantId = restaurantId
            };

            _context.Tables.Add(table);
            await _context.SaveChangesAsync();

            var response = new TableResponseDTO
            {
                TableId = table.TableId,
                Name = table.Name,
                Capacity = table.Capacity,
                Location = table.Location,
                Description = table.Description,
                IsAvailable = table.IsAvailable
            };

            return CreatedAtAction(nameof(GetRestaurantById), new { id = restaurantId }, new
            {
                success = true,
                message = "Tạo bàn thành công",
                data = response
            });
        }

        // PUT: api/nha-hang/ban/{id}
        [HttpPut("ban/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTable(int id, [FromBody] TableUpdateDTO request)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy bàn." });
            }

            table.Name = request.Name;
            table.Capacity = request.Capacity;
            table.Location = request.Location;
            table.Description = request.Description;
            table.IsAvailable = request.IsAvailable;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật bàn thành công"
            });
        }

        // DELETE: api/nha-hang/ban/{id}
        [HttpDelete("ban/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy bàn." });
            }

            // Kiểm tra xem bàn có đơn đặt bàn nào không
            var hasReservations = await _context.Reservations
                .AnyAsync(r => r.TableId == id && 
                          (r.Status == "Chờ xác nhận" || r.Status == "Đã xác nhận"));

            if (hasReservations)
            {
                // Thay vì xóa, đặt trạng thái không hoạt động
                table.IsAvailable = false;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Bàn đã được đặt trạng thái không khả dụng do có đơn đặt bàn."
                });
            }

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Xóa bàn thành công"
            });
        }
    }
} 