import api from './api';
import { 
  DashboardSummary, 
  ReservationStatistics, 
  RecentActivity, 
  User, 
  ApiResponse, 
  Reservation 
} from '../types';

// Các cấu trúc mặc định để trả về khi API không hoạt động
const defaultDashboardSummary: DashboardSummary = {
  totalUsers: 0,
  totalReservations: 0,
  pendingReservations: 0,
  confirmedReservations: 0,
  cancelledReservations: 0,
  completedReservations: 0,
  totalTables: 0,
  totalRestaurants: 0
};

const defaultReservationStatistics: ReservationStatistics = {
  dailyReservations: [],
  restaurantReservations: []
};

const defaultRecentActivity: RecentActivity = {
  recentReservations: [],
  recentUsers: []
};

export const adminService = {
  // Lấy tổng quan cho dashboard
  getDashboardSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    try {
      const response = await api.get<ApiResponse<DashboardSummary>>('/admin/dashboard');
      
      return response.data || { 
        success: true, 
        message: 'Lấy dữ liệu thành công', 
        data: defaultDashboardSummary 
      };
    } catch (error: any) {
      console.error('Error fetching dashboard summary:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: defaultDashboardSummary 
      };
    }
  },

  // Lấy thống kê đặt bàn
  getReservationStatistics: async (days: number = 7): Promise<ApiResponse<ReservationStatistics>> => {
    try {
      const response = await api.get<ApiResponse<ReservationStatistics>>(`/admin/statistics?days=${days}`);
      
      return response.data || { 
        success: true, 
        message: 'Lấy thống kê thành công', 
        data: defaultReservationStatistics 
      };
    } catch (error: any) {
      console.error('Error fetching reservation statistics:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: defaultReservationStatistics 
      };
    }
  },

  // Lấy hoạt động gần đây
  getRecentActivity: async (): Promise<ApiResponse<RecentActivity>> => {
    try {
      const response = await api.get<ApiResponse<RecentActivity>>('/admin/recent-activity');
      
      return response.data || { 
        success: true, 
        message: 'Lấy hoạt động gần đây thành công', 
        data: defaultRecentActivity 
      };
    } catch (error: any) {
      console.error('Error fetching recent activity:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: defaultRecentActivity 
      };
    }
  },

  // Lấy danh sách tất cả đặt bàn (admin)
  getAllReservations: async (
    status?: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse<Reservation[]>> => {
    try {
      let url = '/admin/reservations';
      const params: string[] = [];
      
      if (status) params.push(`status=${status}`);
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await api.get<ApiResponse<Reservation[]>>(url);
      
      return response.data || {
        success: true,
        message: 'Lấy danh sách đặt bàn thành công',
        data: []
      };
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: [] 
      };
    }
  },

  // Lấy danh sách người dùng (admin)
  getAllUsers: async (role?: string, isActive?: boolean): Promise<ApiResponse<User[]>> => {
    try {
      let url = '/admin/users-list';
      const params: string[] = [];
      
      if (role) params.push(`role=${role}`);
      if (isActive !== undefined) params.push(`isActive=${isActive}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await api.get<ApiResponse<User[]>>(url);
      return response.data || { 
        success: true, 
        message: 'Lấy danh sách người dùng thành công', 
        data: [] 
      };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // Thử lại với endpoint /admin/users nếu endpoint chính không hoạt động
      try {
        let fallbackUrl = '/admin/users';
        const params: string[] = [];
        
        if (role) params.push(`role=${role}`);
        if (isActive !== undefined) params.push(`isActive=${isActive}`);
        
        if (params.length > 0) {
          fallbackUrl += `?${params.join('&')}`;
        }
        
        const fallbackResponse = await api.get<ApiResponse<User[]>>(fallbackUrl);
        return fallbackResponse.data || {
          success: true,
          message: 'Lấy danh sách người dùng thành công (fallback)',
          data: []
        };
      } catch (fallbackError) {
        console.error('Error fetching users (fallback):', fallbackError);
        return { 
          success: false, 
          message: 'Lỗi kết nối đến máy chủ', 
          data: [] 
        };
      }
    }
  },

  // Xóa người dùng
  deleteUser: async (userId: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await api.delete<ApiResponse<boolean>>(`/admin/users/${userId}`);
      return response.data || { 
        success: true, 
        message: 'Xóa người dùng thành công', 
        data: true
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { 
        success: false, 
        message: 'Lỗi khi xóa người dùng', 
        data: false 
      };
    }
  },

  // Cập nhật trạng thái người dùng
  updateUserStatus: async (userId: number, isActive: boolean): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/admin/users/${userId}/status`, {
        isActive
      });
      return response.data || { 
        success: true, 
        message: 'Cập nhật trạng thái người dùng thành công', 
        data: {} as User
      };
    } catch (error: any) {
      console.error('Error updating user status:', error);
      return { 
        success: false, 
        message: 'Lỗi khi cập nhật trạng thái người dùng', 
        data: {} as User 
      };
    }
  },

  // Thêm người dùng mới
  createUser: async (userData: Omit<User, 'userId' | 'createdAt' | 'lastLogin'>): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<ApiResponse<User>>('/admin/users', userData);
      return response.data || {
        success: true,
        message: 'Thêm người dùng mới thành công',
        data: {} as User
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi thêm người dùng mới',
        data: {} as User
      };
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/admin/users/${userId}`, userData);
      return response.data || {
        success: true,
        message: 'Cập nhật thông tin người dùng thành công',
        data: {} as User
      };
    } catch (error: any) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật thông tin người dùng',
        data: {} as User
      };
    }
  }
}; 