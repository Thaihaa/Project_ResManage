import api from './api';
import { Reservation, ReservationForm, ApiResponse } from '../types';

export const reservationService = {
  // Lấy tất cả đặt bàn (admin hoặc đặt bàn của user hiện tại)
  getAllReservations: async (): Promise<ApiResponse<Reservation[]>> => {
    try {
      const response = await api.get<ApiResponse<Reservation[]>>('/dat-ban');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Lỗi kết nối đến máy chủ', data: [] };
    }
  },

  // Lấy thông tin chi tiết đặt bàn
  getReservationById: async (id: number): Promise<ApiResponse<Reservation>> => {
    try {
      const response = await api.get<ApiResponse<Reservation>>(`/dat-ban/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as Reservation 
      };
    }
  },

  // Tạo đơn đặt bàn mới
  createReservation: async (reservation: ReservationForm): Promise<ApiResponse<Reservation>> => {
    try {
      const response = await api.post<ApiResponse<Reservation>>('/dat-ban', reservation);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { 
        success: false, 
        message: 'Lỗi kết nối đến máy chủ', 
        data: {} as Reservation 
      };
    }
  },

  // Cập nhật thông tin đặt bàn
  updateReservation: async (id: number, reservation: ReservationForm): Promise<ApiResponse<any>> => {
    try {
      const response = await api.put<ApiResponse<any>>(`/dat-ban/${id}`, reservation);
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

  // Cập nhật trạng thái đặt bàn (xác nhận, hủy, hoàn thành)
  updateReservationStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.put<ApiResponse<any>>(`/dat-ban/${id}/status`, { status });
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

  // Hủy đặt bàn (có thể gọi phương thức updateReservationStatus với status = "Đã hủy")
  cancelReservation: async (id: number): Promise<ApiResponse<any>> => {
    return reservationService.updateReservationStatus(id, 'Đã hủy');
  },

  // Xóa đặt bàn (admin hoặc chủ đặt bàn)
  deleteReservation: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.delete<ApiResponse<any>>(`/dat-ban/${id}`);
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