import React, { useState } from 'react';
import { Box, Container, Typography, Avatar, Rating, Paper, Grid, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: '/images/avatar1.jpg',
    rating: 5,
    comment: 'Đồ ăn rất ngon, đặc biệt là nước lẩu đậm đà. Nhân viên phục vụ rất chu đáo và nhiệt tình. Chắc chắn sẽ quay lại!',
    date: '15/05/2023'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: '/images/avatar2.jpg',
    rating: 4.5,
    comment: 'Không gian nhà hàng rất đẹp, menu đa dạng. Tôi đặc biệt thích món bò Mỹ cuộn nấm, thịt mềm và rất ngọt.',
    date: '20/06/2023'
  },
  {
    id: 3,
    name: 'Phạm Văn C',
    avatar: '/images/avatar3.jpg',
    rating: 5,
    comment: 'Đến đây lần thứ 3 và vẫn rất hài lòng. Giá cả hợp lý so với chất lượng. Sẽ giới thiệu cho bạn bè và gia đình.',
    date: '05/07/2023'
  },
  {
    id: 4,
    name: 'Lê Thị D',
    avatar: '/images/avatar4.jpg',
    rating: 4,
    comment: 'Món ăn ngon, không gian thoáng mát. Chỉ có điều thời gian phục vụ hơi lâu vào cuối tuần khi quá đông khách.',
    date: '10/08/2023'
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    avatar: '/images/avatar5.jpg',
    rating: 5,
    comment: 'Lẩu Đài Loan chính hiệu, đồ nhúng tươi ngon. Đặc biệt khen ngợi đội ngũ nhân viên rất thân thiện và chuyên nghiệp.',
    date: '25/09/2023'
  }
];

const ReviewSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const visibleReviews = reviews.slice(
    activeIndex * reviewsPerPage,
    Math.min((activeIndex + 1) * reviewsPerPage, reviews.length)
  );

  return (
    <Box sx={{ bgcolor: '#fff', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#C12F31',
            }}
          >
            Khách Hàng Nói Gì Về Chúng Tôi
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Những đánh giá chân thực từ khách hàng là động lực giúp chúng tôi không ngừng cải thiện chất lượng dịch vụ
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={3}>
            {visibleReviews.map((review) => (
              <Grid size={{ xs: 12, md: 4 }} key={review.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '8px',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={review.avatar}
                      alt={review.name}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Rating 
                    value={review.rating} 
                    precision={0.5} 
                    readOnly 
                    sx={{ mb: 2 }} 
                  />
                  
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontStyle: 'italic',
                      color: '#555',
                      lineHeight: 1.6
                    }}
                  >
                    "{review.comment}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              gap: 2
            }}>
              <IconButton 
                onClick={handlePrev} 
                sx={{ 
                  bgcolor: '#f0f0f0',
                  '&:hover': { bgcolor: '#e0e0e0' } 
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton 
                onClick={handleNext} 
                sx={{ 
                  bgcolor: '#f0f0f0',
                  '&:hover': { bgcolor: '#e0e0e0' } 
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ReviewSection; 