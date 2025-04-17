import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();

  // Tính tổng giá trị đơn hàng
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Hãy thêm các món ăn bạn yêu thích vào giỏ hàng
          </Typography>
          <Button 
            component={Link} 
            to="/thuc-don" 
            variant="contained" 
            color="primary"
            size="large"
          >
            Xem thực đơn
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Giỏ hàng của bạn ({totalItems} món)
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            {items.map((item) => (
              <Box 
                key={item.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2,
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Box sx={{ width: 80, height: 80, mr: 2 }}>
                  <img 
                    src={item.image || '/images/placeholder.png'} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đơn giá: {item.price.toLocaleString('vi-VN')}₫
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <Typography sx={{ width: 30, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </Box>
                <Box sx={{ width: 100, textAlign: 'right', ml: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </Typography>
                </Box>
                <Button 
                  color="error" 
                  size="small"
                  onClick={() => removeItem(item.id)}
                  sx={{ ml: 1 }}
                >
                  Xóa
                </Button>
              </Box>
            ))}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/thuc-don"
            >
              Tiếp tục mua sắm
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={clearCart}
            >
              Xóa giỏ hàng
            </Button>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
              Tóm tắt đơn hàng
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
              <Typography>Tổng tiền:</Typography>
              <Typography fontWeight="bold">
                {totalPrice.toLocaleString('vi-VN')}₫
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              component={Link}
              to="/dat-ban"
              sx={{ mt: 2 }}
            >
              Đặt bàn
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage; 