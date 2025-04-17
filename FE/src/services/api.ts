import axios from 'axios';

// Tạo instance axios với các cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:5255/api', // URL của backend API
  timeout: 15000, // Tăng timeout từ 10s lên 15s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Gửi request với token:', token);
      console.log('Authorization header:', config.headers['Authorization']);
    } else {
      console.log('Không có token trong localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log chi tiết thông tin lỗi
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    console.error(`API Error (${statusCode}):`, errorMessage);
    
    // Xử lý theo từng loại lỗi
    if (error.response) {
      // Server trả về response với status code không thành công
      switch (statusCode) {
        case 401: // Unauthorized
          console.error('Authentication error: User is not authenticated');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;
        case 403: // Forbidden
          console.error('Authorization error: User does not have permission');
          break;
        case 404: // Not Found
          console.error('Resource not found');
          break;
        case 500: // Server Error
          console.error('Server error occurred');
          break;
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('No response received from server', error.request);
    } else {
      // Lỗi khi thiết lập request
      console.error('Error setting up request', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 