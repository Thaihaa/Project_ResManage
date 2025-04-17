import api from './api';
import { Restaurant, RestaurantDetail, Table, ApiResponse } from '../types';

export const restaurantService = {
  // Lấy danh sách tất cả nhà hàng
  getAllRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => {
    try {
      const response = await api.get<ApiResponse<Restaurant[]>>('/nha-hang');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Lỗi kết nối đến máy chủ', data: [] };
    }
  },

  // Lấy thông tin chi tiết của một nhà hàng
  getRestaurantById: async (id: number): Promise<ApiResponse<RestaurantDetail>> => {
    try {
      const response = await api.get<ApiResponse<RestaurantDetail>>(`/nha-hang/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as RestaurantDetail 
      };
    }
  },

  // Tạo nhà hàng mới (chỉ admin)
  createRestaurant: async (restaurant: Omit<Restaurant, 'restaurantId'>): Promise<ApiResponse<Restaurant>> => {
    try {
      const response = await api.post<ApiResponse<Restaurant>>('/nha-hang', restaurant);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as Restaurant 
      };
    }
  },

  // Cập nhật thông tin nhà hàng (chỉ admin)
  updateRestaurant: async (id: number, restaurant: Partial<Restaurant>): Promise<ApiResponse<any>> => {
    try {
      const response = await api.put<ApiResponse<any>>(`/nha-hang/${id}`, restaurant);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} 
      };
    }
  },

  // Xóa nhà hàng (chỉ admin)
  deleteRestaurant: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete<ApiResponse<any>>(`/nha-hang/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} 
      };
    }
  },

  // Tạo bàn mới cho nhà hàng (chỉ admin)
  createTable: async (restaurantId: number, table: Omit<Table, 'tableId'>): Promise<ApiResponse<Table>> => {
    try {
      const response = await api.post<ApiResponse<Table>>(`/nha-hang/${restaurantId}/ban`, table);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as Table 
      };
    }
  },

  // Cập nhật thông tin bàn (chỉ admin)
  updateTable: async (id: number, table: Partial<Table>): Promise<ApiResponse<any>> => {
    try {
      const response = await api.put<ApiResponse<any>>(`/nha-hang/ban/${id}`, table);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} 
      };
    }
  },

  // Xóa bàn (chỉ admin)
  deleteTable: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete<ApiResponse<any>>(`/nha-hang/ban/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} 
      };
    }
  }
}; 