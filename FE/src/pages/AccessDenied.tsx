import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';

const AccessDenied: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh' 
      }}>
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <SecurityIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h4" component="h1" color="error" gutterBottom>
            Truy cập bị từ chối
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là lỗi.
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/" 
              startIcon={<HomeIcon />}
              color="primary"
            >
              Về trang chủ
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/dang-nhap" 
              color="primary"
            >
              Đăng nhập với tài khoản khác
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AccessDenied; 