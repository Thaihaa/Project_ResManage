using Microsoft.AspNetCore.Mvc;

namespace QLNhaHang.API.Controllers
{
    [Route("api/mon-an")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllMenuItems()
        {
            // Tạo dữ liệu giả cho danh sách món ăn
            var menuItems = new[]
            {
                new
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Gà nướng muối ớt",
                    Description = "Gà nướng thơm ngon với gia vị đặc biệt",
                    Price = 180000,
                    DiscountPrice = 160000,
                    Image = "menu1.jpg",
                    PrepTime = 20,
                    IsAvailable = true,
                    IsFeatured = true,
                    CategoryId = "1",
                    CategoryName = "Món nướng",
                    RestaurantId = "1"
                },
                new
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Bò lúc lắc",
                    Description = "Bò xào với ớt chuông và hành tây",
                    Price = 220000,
                    DiscountPrice = 0,
                    Image = "menu2.jpg",
                    PrepTime = 15,
                    IsAvailable = true,
                    IsFeatured = true,
                    CategoryId = "2",
                    CategoryName = "Món xào",
                    RestaurantId = "1"
                },
                new
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Canh chua cá lóc",
                    Description = "Canh chua truyền thống Nam Bộ",
                    Price = 150000,
                    DiscountPrice = 0,
                    Image = "menu3.jpg",
                    PrepTime = 25,
                    IsAvailable = true,
                    IsFeatured = false,
                    CategoryId = "3",
                    CategoryName = "Món canh",
                    RestaurantId = "1"
                }
            };

            return Ok(new
            {
                success = true,
                data = menuItems
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetMenuItemById(string id)
        {
            // Tạo dữ liệu giả cho món ăn cụ thể
            var menuItem = new
            {
                Id = id,
                Name = "Gà nướng muối ớt",
                Description = "Gà nướng thơm ngon với gia vị đặc biệt",
                Price = 180000,
                DiscountPrice = 160000,
                Image = "menu1.jpg",
                PrepTime = 20,
                IsAvailable = true,
                IsFeatured = true,
                CategoryId = "1",
                CategoryName = "Món nướng",
                RestaurantId = "1"
            };

            return Ok(new
            {
                success = true,
                data = menuItem
            });
        }
    }

    [Route("api/loai-mon-an")]
    [ApiController]
    public class MenuCategoryController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllCategories()
        {
            // Tạo dữ liệu giả cho danh sách loại món ăn
            var categories = new[]
            {
                new
                {
                    Id = "1",
                    Name = "Món nướng",
                    Description = "Các món ăn được chế biến bằng phương pháp nướng",
                    Image = "category1.jpg"
                },
                new
                {
                    Id = "2",
                    Name = "Món xào",
                    Description = "Các món ăn được chế biến bằng phương pháp xào",
                    Image = "category2.jpg"
                },
                new
                {
                    Id = "3",
                    Name = "Món canh",
                    Description = "Các món canh truyền thống Việt Nam",
                    Image = "category3.jpg"
                }
            };

            return Ok(new
            {
                success = true,
                data = categories
            });
        }
    }
} 