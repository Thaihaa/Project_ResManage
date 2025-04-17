using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Data;
using QLNhaHang.API.Models;
using System;
using System.Threading.Tasks;

namespace QLNhaHang.API.Services
{
    public class ReservationService
    {
        private readonly ApplicationDbContext _context;

        public ReservationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsTableAvailable(int tableId, DateTime date, string startTime, string endTime, int? excludeReservationId = null)
        {
            var query = _context.Reservations
                .Where(r => r.TableId == tableId &&
                            r.ReservationDate.Date == date.Date &&
                            ((r.StartTime.CompareTo(startTime) <= 0 && r.EndTime.CompareTo(startTime) > 0) ||
                             (r.StartTime.CompareTo(endTime) < 0 && r.EndTime.CompareTo(endTime) >= 0) ||
                             (r.StartTime.CompareTo(startTime) >= 0 && r.EndTime.CompareTo(endTime) <= 0)) &&
                            r.Status != "Đã hủy");

            if (excludeReservationId.HasValue)
            {
                query = query.Where(r => r.ReservationId != excludeReservationId.Value);
            }

            var conflictingReservations = await query.AnyAsync();
            return !conflictingReservations;
        }

        public async Task<ServiceResult> CreateReservation(Reservation reservation)
        {
            try
            {
                // Kiểm tra bàn có sẵn không
                bool isAvailable = await IsTableAvailable(
                    reservation.TableId, 
                    reservation.ReservationDate, 
                    reservation.StartTime, 
                    reservation.EndTime);

                if (!isAvailable)
                {
                    return ServiceResult.Failure("Bàn đã được đặt trong khoảng thời gian này.");
                }

                reservation.CreatedAt = DateTime.Now;
                reservation.Status = "Chờ xác nhận";

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                return ServiceResult.Success("Đặt bàn thành công.");
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure($"Lỗi khi đặt bàn: {ex.Message}");
            }
        }

        public async Task<ServiceResult> UpdateReservationStatus(int reservationId, string newStatus)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(reservationId);
                if (reservation == null)
                {
                    return ServiceResult.Failure("Không tìm thấy đặt bàn.");
                }

                // Kiểm tra trạng thái hợp lệ
                if (newStatus != "Chờ xác nhận" && 
                    newStatus != "Đã xác nhận" && 
                    newStatus != "Đã hủy" && 
                    newStatus != "Hoàn thành")
                {
                    return ServiceResult.Failure("Trạng thái không hợp lệ.");
                }

                reservation.Status = newStatus;
                await _context.SaveChangesAsync();

                return ServiceResult.Success("Cập nhật trạng thái đặt bàn thành công.");
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure($"Lỗi khi cập nhật trạng thái: {ex.Message}");
            }
        }
    }
} 