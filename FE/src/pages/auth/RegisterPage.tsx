import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Đăng ký tài khoản
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Tạo tài khoản để đặt bàn và sử dụng dịch vụ nhà hàng
        </Typography>
        <Box sx={{ mt: 4 }}>
          <RegisterForm />
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage; 