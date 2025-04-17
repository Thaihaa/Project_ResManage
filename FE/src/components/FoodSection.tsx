import React from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';

interface FoodItem {
  id: number;
  name: string;
  image: string;
  description: string;
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: 'Nước Lẩu Hải Sản Đặc Biệt',
    image: '/images/food1.jpg',
    description: 'Nước lẩu được nấu từ xương gà, xương heo kết hợp với hải sản tươi ngon tạo nên hương vị đậm đà, ngọt thanh'
  },
  {
    id: 2,
    name: 'Bò Mỹ Cuộn Nấm',
    image: '/images/food2.jpg',
    description: 'Thịt bò Mỹ thượng hạng cuộn nấm kim châm tươi, kết hợp với nước lẩu đặc trưng'
  },
  {
    id: 3,
    name: 'Viên Tôm Chả Cá',
    image: '/images/food3.jpg',
    description: 'Viên tôm kết hợp với chả cá tươi ngon tạo nên món ăn đặc sắc'
  },
  {
    id: 4,
    name: 'Combo Đồ Nhúng Đặc Biệt',
    image: '/images/food4.jpg',
    description: 'Tổng hợp các loại đồ nhúng đặc sắc nhất cho bạn trải nghiệm trọn vẹn'
  }
];

const FoodSection: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f9f9f9', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#C12F31',
            }}
          >
            Thực Đơn Nổi Bật
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mb: 3 }}>
            Khám phá các món ăn đặc sắc nhất được lựa chọn cẩn thận từ đầu bếp của chúng tôi,
            mang đến trải nghiệm ẩm thực Đài Loan chính thống
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {foodItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                },
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#C12F31', 
              '&:hover': { 
                bgcolor: '#A11F21' 
              },
              px: 4,
              py: 1.5,
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Xem Toàn Bộ Thực Đơn
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FoodSection; 