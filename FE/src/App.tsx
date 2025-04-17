import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, Typography, Button } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/customer/HomePage';
import CartPage from './pages/customer/CartPage';
import AdminRoutes from './routes/AdminRoutes';

// Trang tạm thời cho các mục menu
const PromotionPage = () => <Box sx={{ py: 8 }}><CssBaseline /><Box sx={{ textAlign: 'center', py: 10 }}>Trang Ưu Đãi - Đang phát triển</Box></Box>;
const LocationPage = () => <Box sx={{ py: 8 }}><CssBaseline /><Box sx={{ textAlign: 'center', py: 10 }}>Trang Vị Trí Cửa Hàng - Đang phát triển</Box></Box>;
const MenuPage = () => <Box sx={{ py: 8 }}><CssBaseline /><Box sx={{ textAlign: 'center', py: 10 }}>Trang Thực Đơn - Đang phát triển</Box></Box>;
const ReservationPage = () => <Box sx={{ py: 8 }}><CssBaseline /><Box sx={{ textAlign: 'center', py: 10 }}>Trang Đặt Bàn - Đang phát triển</Box></Box>;

// Trang truy cập bị từ chối
const AccessDeniedPage = () => (
  <Box sx={{ py: 8 }}>
    <CssBaseline />
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h4" gutterBottom>Truy cập bị từ chối</Typography>
      <Typography variant="body1" paragraph>
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cần trợ giúp.
      </Typography>
      <Button variant="contained" component="a" href="/">
        Quay lại trang chủ
      </Button>
    </Box>
  </Box>
);

// Trang không tìm thấy
const NotFoundPage = () => (
  <Box sx={{ py: 8 }}>
    <CssBaseline />
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h4" gutterBottom>Không tìm thấy trang</Typography>
      <Typography variant="body1" paragraph>
        Trang bạn đang tìm kiếm không tồn tại.
      </Typography>
      <Button variant="contained" component="a" href="/">
        Quay lại trang chủ
      </Button>
    </Box>
  </Box>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <CssBaseline />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <HomePage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/dang-nhap" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <LoginPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/dang-ky" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <RegisterPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <CartPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/thuc-don" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <MenuPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/uu-dai" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <PromotionPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/dat-ban" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <ReservationPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/vi-tri-cua-hang" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <LocationPage />
                  </Box>
                  <Footer />
                </>
              } />
              <Route path="/access-denied" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <AccessDeniedPage />
                  </Box>
                  <Footer />
                </>
              } />

              {/* Admin routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              {/* Error routes */}
              <Route path="*" element={
                <>
                  <Header />
                  <Box component="main" sx={{ flex: 1 }}>
                    <NotFoundPage />
                  </Box>
                  <Footer />
                </>
              } />
            </Routes>
          </Box>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
