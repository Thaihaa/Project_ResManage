# ỨNG DỤNG QUẢN LÝ NHÀ HÀNG - BACKEND .NET

Đây là phần backend của ứng dụng quản lý nhà hàng được phát triển bằng .NET 9.0.

## Cấu trúc dự án

Dự án được tổ chức theo mô hình kiến trúc sạch (Clean Architecture) với các layer:

- **QLNhaHang.Core**: Chứa các entities, interfaces, và business logic.
- **QLNhaHang.Infrastructure**: Chứa implemention của các interfaces trong Core, cung cấp truy cập dữ liệu thông qua Entity Framework Core.
- **QLNhaHang.API**: WebAPI cung cấp các endpoints cho frontend.

## Yêu cầu

- .NET 9.0 SDK
- SQL Server (LocalDB hoặc SQL Server Express)
- Visual Studio 2022 hoặc Visual Studio Code

## Cài đặt

1. Clone repository:
```
git clone <repository-url>
```

2. Di chuyển vào thư mục dự án:
```
cd BE.NET
```

3. Khôi phục các gói NuGet:
```
dotnet restore
```

4. Cập nhật cơ sở dữ liệu:
```
dotnet ef database update --project QLNhaHang.Infrastructure --startup-project QLNhaHang.API
```
(Lưu ý: Cần cài đặt Entity Framework Core CLI tools: `dotnet tool install --global dotnet-ef`)

5. Chạy ứng dụng:
```
dotnet run --project QLNhaHang.API
```

## API Endpoints

API sẽ được khởi chạy tại `https://localhost:5001` và `http://localhost:5000`

### Xác thực
- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/register`: Đăng ký
- `POST /api/auth/change-password`: Đổi mật khẩu (yêu cầu xác thực)

### Người dùng
- `GET /api/users`: Lấy danh sách người dùng (chỉ admin)
- `GET /api/users/{id}`: Lấy thông tin người dùng cụ thể
- `GET /api/users/profile`: Lấy thông tin người dùng hiện tại
- `PUT /api/users/profile`: Cập nhật thông tin cá nhân
- `PUT /api/users/{id}`: Cập nhật thông tin người dùng (chỉ admin)
- `PUT /api/users/{id}/status`: Cập nhật trạng thái người dùng (chỉ admin)
- `PUT /api/users/{id}/role`: Cập nhật vai trò người dùng (chỉ admin)
- `DELETE /api/users/{id}`: Xóa người dùng (chỉ admin)

### Swagger
API documentation có thể truy cập tại `https://localhost:5001/swagger`

## Tích hợp với Frontend

API này được thiết kế để hoạt động với frontend ReactJS. Đảm bảo rằng frontend được cấu hình để gọi đến endpoints của API này.

## Bảo mật

- Mật khẩu được mã hóa trước khi lưu trữ
- Xác thực thông qua JSON Web Token (JWT)
- Middleware kiểm soát quyền truy cập dựa trên vai trò người dùng

## License

[MIT License](LICENSE) 