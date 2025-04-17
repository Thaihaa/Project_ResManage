import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Divider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }

    try {
      setLoading(true);
      const success = await login({ username, password });
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Đăng Nhập
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </form>
          
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />
          
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 