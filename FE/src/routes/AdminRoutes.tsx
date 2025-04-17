import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import { authService } from '../services/authService';

// Trang không có quyền truy cập
const UnauthorizedPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Không có quyền truy cập</h2>
    <p>Bạn không có quyền truy cập vào trang này.</p>
    <a href="/" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
      Quay lại trang chủ
    </a>
  </div>
);

const AdminRoutes: React.FC = () => {
  // Kiểm tra xem user có quyền admin không
  const isAdmin = true; // Tạm thời hardcode là true để bypass authentication
  // const isAdmin = authService.isAdmin();
  
  if (!isAdmin) {
    return <UnauthorizedPage />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      {/* Thêm các route admin khác ở đây */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 