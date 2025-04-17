import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, ApiResponse, User } from '../types';

// Admin mặc định để đăng nhập nhanh
const DEFAULT_ADMIN = {
  userId: 1,
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Admin User',
  phoneNumber: '0123456789',
  role: 'Admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  password: 'admin123'
};

// Lưu admin mặc định vào localStorage
const initDefaultAdmin = () => {
  // Kiểm tra xem đã có admin mặc định chưa
  const adminStr = localStorage.getItem('default_admin');
  if (!adminStr) {
    localStorage.setItem('default_admin', JSON.stringify(DEFAULT_ADMIN));
    console.log('Đã tạo tài khoản admin mặc định:');
    console.log('- Tên đăng nhập: admin');
    console.log('- Mật khẩu: admin123');
  }
};

// Khởi tạo admin mặc định
initDefaultAdmin();

export const authService = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    try {
      /* 
      // Đoạn code giả lập (MOCK) - Bỏ qua khi triển khai thực tế
      // Kiểm tra đăng nhập với tài khoản admin mặc định
      const adminStr = localStorage.getItem('default_admin');
      if (adminStr) {
        const admin = JSON.parse(adminStr);
        if (credentials.username === admin.username && credentials.password === admin.password) {
          console.log('Đăng nhập thành công với tài khoản admin mặc định');
          
          // Lưu vào localStorage
          localStorage.setItem('token', 'mock_token_for_development_1234567890');
          localStorage.setItem('user', JSON.stringify(admin));
          
          // Trả về kết quả thành công
          return {
            success: true,
            message: 'Đăng nhập thành công',
            data: {
              token: 'mock_token_for_development_1234567890',
              username: admin.username,
              email: admin.email,
              role: admin.role
            }
          };
        }
      }
      
      // Dữ liệu đăng nhập giả lập cho mục đích phát triển
      console.log('Đang đăng nhập với:', credentials);
      
      // Tạo dữ liệu giả lập cho người dùng thường
      const mockUserData = {
        userId: 2,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        fullName: 'Người dùng',
        phoneNumber: '0123456789',
        role: 'User',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Lưu vào localStorage
      localStorage.setItem('token', 'mock_token_for_development_0987654321');
      localStorage.setItem('user', JSON.stringify(mockUserData));
      
      // Trả về kết quả thành công
      return {
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          token: 'mock_token_for_development_0987654321',
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          role: 'User'
        }
      };
      */
      
      // Mã nguồn thực tế
      // Chuyển đổi định dạng dữ liệu nếu cần (tùy theo API backend)
      const requestData = {
        username: credentials.username,
        password: credentials.password
      };
      
      console.log('Đang gọi API đăng nhập với:', requestData);
      const response = await api.post<any>('/auth/login', requestData);
      console.log('Phản hồi API:', response.data);
      
      // Kiểm tra cả hai định dạng phản hồi có thể có từ backend
      if (response.data.IsSuccess !== undefined && response.data.Token) {
        // Định dạng từ backend .NET
        localStorage.setItem('token', response.data.Token);
        
        const userData = {
          userId: response.data.UserId || 0,
          username: response.data.Username || '',
          email: response.data.Email || '',
          fullName: response.data.FullName || '',
          phoneNumber: response.data.PhoneNumber || '',
          role: response.data.Role || 'User',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Chuyển đổi sang định dạng mà frontend hiểu
        return {
          success: true,
          message: response.data.Message || 'Đăng nhập thành công',
          data: {
            token: response.data.Token,
            username: userData.username,
            email: userData.email,
            role: userData.role
          } as AuthResponse
        };
      } else if (response.data.success && response.data.data && response.data.data.token) {
        // Định dạng hiện tại của frontend
        localStorage.setItem('token', response.data.data.token);
        
        const userData = {
          userId: response.data.data.userId || 0,
          username: response.data.data.username || '',
          email: response.data.data.email || '',
          fullName: response.data.data.fullName || '',
          phoneNumber: response.data.data.phoneNumber || '',
          role: response.data.data.role || 'User',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        return response.data;
      } else if (response.data.IsSuccess === false) {
        // Xử lý lỗi từ backend .NET
        return {
          success: false,
          message: response.data.Message || 'Đăng nhập thất bại',
          data: response.data as AuthResponse
        };
      } else {
        // Định dạng khác không xác định
        console.error('Không thể xử lý định dạng phản hồi:', response.data);
        return {
          success: false,
          message: 'Định dạng phản hồi không hợp lệ',
          data: {} as AuthResponse
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response && error.response.data) {
        // Xử lý lỗi từ API
        if (error.response.data.IsSuccess !== undefined) {
          // Định dạng .NET
          return {
            success: false,
            message: error.response.data.Message || 'Đăng nhập thất bại',
            data: error.response.data as AuthResponse
          };
        }
      }
      
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as AuthResponse 
      };
    }
  },

  // Đăng ký
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
    try {
      // Chuyển đổi định dạng dữ liệu nếu cần (tùy theo API backend)
      const requestData = {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        fullName: credentials.fullName,
        phoneNumber: credentials.phoneNumber
      };
      
      const response = await api.post<any>('/auth/register', requestData);
      
      // Kiểm tra cả hai định dạng phản hồi có thể có từ backend
      if (response.data.IsSuccess && response.data.Token) {
        // Định dạng từ backend .NET
        localStorage.setItem('token', response.data.Token);
        
        const userData = {
          username: response.data.Username,
          email: response.data.Email,
          role: response.data.Role || 'User'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Chuyển đổi sang định dạng mà frontend hiểu
        return {
          success: true,
          message: response.data.Message || 'Đăng ký thành công',
          data: response.data as AuthResponse
        };
      } else if (response.data.success && response.data.data && response.data.data.token) {
        // Định dạng hiện tại của frontend
        localStorage.setItem('token', response.data.data.token);
        
        const userData = {
          username: response.data.data.username,
          email: response.data.data.email,
          role: response.data.data.role || 'User'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        return response.data;
      } else if (!response.data.IsSuccess) {
        // Xử lý lỗi từ backend .NET
        return {
          success: false,
          message: response.data.Message || 'Đăng ký thất bại',
          data: response.data as AuthResponse
        };
      } else {
        // Định dạng khác không xác định
        console.error('Không thể xử lý định dạng phản hồi:', response.data);
        return {
          success: false,
          message: 'Định dạng phản hồi không hợp lệ',
          data: {} as AuthResponse
        };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response && error.response.data) {
        // Xử lý lỗi từ API
        if (error.response.data.IsSuccess !== undefined) {
          // Định dạng .NET
          return {
            success: false,
            message: error.response.data.Message || 'Đăng ký thất bại',
            data: error.response.data as AuthResponse
          };
        }
        return error.response.data;
      }
      
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as AuthResponse 
      };
    }
  },

  // Đăng xuất
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Kiểm tra xem đã đăng nhập chưa
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Đảm bảo dữ liệu user có đủ các trường cần thiết
        const defaultData = {
          userId: 0,
          username: '',
          email: '',
          fullName: '',
          phoneNumber: '',
          role: 'User',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        };
        
        // Kết hợp dữ liệu mặc định và dữ liệu người dùng thực tế
        return { ...defaultData, ...userData } as User;
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user'); // Xóa dữ liệu không hợp lệ
        return null;
      }
    }
    return null;
  },

  // Kiểm tra xem user có phải là admin không
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user !== null && user.role === 'Admin';
  }
}; 