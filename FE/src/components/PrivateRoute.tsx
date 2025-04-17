import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireAdmin = false }) => {
  const { authState, isAdmin } = useAuth();
  const location = useLocation();

  if (authState.loading) {
    // Đang tải thông tin xác thực, hiển thị loading
    return <div>Đang tải...</div>;
  }

  if (!authState.isAuthenticated) {
    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Người dùng không phải admin, chuyển hướng đến trang từ chối truy cập
    return <Navigate to="/access-denied" replace />;
  }

  // Người dùng đã đăng nhập và có quyền truy cập
  return <>{children}</>;
};

export default PrivateRoute; 