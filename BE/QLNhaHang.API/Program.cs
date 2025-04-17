using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QLNhaHang.API.Data;
using QLNhaHang.API.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }));

// Đăng ký service
builder.Services.AddScoped<AuthService>();

// Thêm cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Content-Disposition");
    });
});

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "thisisasecretkeyforgeneratingjwttokens123456789"))
        };
        
        // Cho phép nhận token mà không cần từ khóa Bearer
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        
        // Tùy chỉnh để có thể xử lý token trực tiếp không cần Bearer
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                string token = null;
                var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                
                // Trường hợp 1: Header Authorization với Bearer
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                {
                    token = authHeader.Substring("Bearer ".Length).Trim();
                }
                // Trường hợp 2: Header Authorization không có Bearer
                else if (!string.IsNullOrEmpty(authHeader))
                {
                    token = authHeader.Trim();
                }
                // Trường hợp 3: Token trong query string (ít khi sử dụng nhưng hỗ trợ thêm)
                else if (context.Request.Query.ContainsKey("access_token"))
                {
                    token = context.Request.Query["access_token"];
                }
                
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                // Log lỗi xác thực để giúp debug
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "QL Nha Hang API", 
        Version = "v1",
        Description = "API quản lý nhà hàng",
        Contact = new OpenApiContact
        {
            Name = "Support",
            Email = "support@example.com"
        }
    });
    
    // Configure Swagger to use JWT Authentication
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "API key authentication. Just paste your JWT token directly without 'Bearer' prefix.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKey"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                }
            },
            new string[] {}
        }
    });
    
    // Cấu hình khác cho Swagger
    c.CustomSchemaIds(type => type.FullName);
    c.DescribeAllParametersInCamelCase();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "QL Nha Hang API v1");
        c.RoutePrefix = "swagger";
    });
}

// Thêm CORS middleware
app.UseCors();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Đảm bảo tài khoản admin mặc định được tạo khi ứng dụng khởi động
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var authService = services.GetRequiredService<AuthService>();
    
    // Bất đồng bộ nhưng phải đợi hoàn thành trước khi tiếp tục
    authService.EnsureAdminAccountCreated().GetAwaiter().GetResult();
}

app.Run();
