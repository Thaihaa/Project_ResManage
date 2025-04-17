import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../../types';

const LoginForm: React.FC = () => {
  const { login, authState } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    try {
      const success = await login(data);
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Đăng nhập
      </Typography>
      
      {(error || authState.error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || authState.error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="username"
          control={control}
          rules={{ required: 'Tên đăng nhập không được để trống' }}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tên đăng nhập"
              autoComplete="username"
              autoFocus
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />
        
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Mật khẩu không được để trống' }}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={authState.loading}
        >
          {authState.loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Chưa có tài khoản?{' '}
            <Button
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              Đăng ký ngay
            </Button>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm; 