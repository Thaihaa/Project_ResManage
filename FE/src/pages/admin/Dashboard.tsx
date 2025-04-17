import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Container,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar 
} from '@mui/material';
import { PeopleAlt, Restaurant, EventAvailable, Person } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { DashboardSummary, ReservationStatistics, RecentActivity } from '../../types';
import AdminLayout from './layout/AdminLayout';



const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalUsers: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalTables: 0,
    totalRestaurants: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
    completedReservations: 0
  });
  
  const [statistics, setStatistics] = useState<ReservationStatistics>({
    dailyReservations: [],
    restaurantReservations: []
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    recentReservations: [],
    recentUsers: []
  });
  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Lấy dữ liệu tổng quan
        const summaryResponse = await adminService.getDashboardSummary();
        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }
        
        // Lấy thống kê đặt bàn
        const statisticsResponse = await adminService.getReservationStatistics();
        if (statisticsResponse.success) {
          setStatistics(statisticsResponse.data);
        }
        
        // Lấy hoạt động gần đây
        const activityResponse = await adminService.getRecentActivity();
        if (activityResponse.success) {
          setRecentActivity(activityResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <>
            {/* Thẻ thống kê */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  flex: '1 0 200px',
                }}
                elevation={3}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                    <PeopleAlt />
                  </Avatar>
                  <Typography color="text.secondary" variant="subtitle1">
                    Tổng người dùng
                  </Typography>
                </Box>
                <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                  {summary.totalUsers}
                </Typography>
              </Paper>
              
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  flex: '1 0 200px',
                }}
                elevation={3}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 1 }}>
                    <EventAvailable />
                  </Avatar>
                  <Typography color="text.secondary" variant="subtitle1">
                    Tổng đặt bàn
                  </Typography>
                </Box>
                <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                  {summary.totalReservations}
                </Typography>
              </Paper>
              
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  flex: '1 0 200px',
                }}
                elevation={3}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 1 }}>
                    <EventAvailable />
                  </Avatar>
                  <Typography color="text.secondary" variant="subtitle1">
                    Đặt bàn đang chờ
                  </Typography>
                </Box>
                <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                  {summary.pendingReservations}
                </Typography>
              </Paper>
              
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  flex: '1 0 200px',
                }}
                elevation={3}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'error.main', mr: 1 }}>
                    <Restaurant />
                  </Avatar>
                  <Typography color="text.secondary" variant="subtitle1">
                    Tổng số bàn
                  </Typography>
                </Box>
                <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                  {summary.totalTables}
                </Typography>
              </Paper>
            </Box>

            {/* Biểu đồ */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                  flex: '2 1 600px',
                }}
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  Đặt bàn theo ngày (7 ngày gần đây)
                </Typography>
                {statistics?.dailyReservations && statistics.dailyReservations.length > 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" color="text.secondary">
                      Biểu đồ đang được bảo trì
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" color="text.secondary">
                      Không có dữ liệu
                    </Typography>
                  </Box>
                )}
              </Paper>
              
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                  flex: '1 1 300px',
                }}
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  Đặt bàn theo nhà hàng
                </Typography>
                {statistics?.restaurantReservations && statistics.restaurantReservations.length > 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" color="text.secondary">
                      Biểu đồ đang được bảo trì
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" color="text.secondary">
                      Không có dữ liệu
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
            
            {/* Hoạt động gần đây */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Paper sx={{ p: 2, flex: '1 1 450px' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Đặt bàn gần đây
                </Typography>
                <List>
                  {recentActivity?.recentReservations && recentActivity.recentReservations.length > 0 ? (
                    recentActivity.recentReservations.map((reservation, index) => (
                      <React.Fragment key={reservation.reservationId || index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>
                              <Person />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={reservation.userName || 'Không có tên'}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleString() : 'Không có ngày giờ'}
                                </Typography>
                                {` — ${reservation.status || 'Không có trạng thái'} - Nhà hàng: ${reservation.restaurantName || 'Không xác định'}`}
                              </>
                            }
                          />
                        </ListItem>
                        {index < (recentActivity.recentReservations.length - 1) && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                      Không có đặt bàn gần đây
                    </Typography>
                  )}
                </List>
              </Paper>
              
              <Paper sx={{ p: 2, flex: '1 1 450px' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Người dùng mới
                </Typography>
                <List>
                  {recentActivity?.recentUsers && recentActivity.recentUsers.length > 0 ? (
                    recentActivity.recentUsers.map((user, index) => (
                      <React.Fragment key={user.userId || index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>
                              <Person />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.username || 'Không có tên'}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {user.email || 'Không có email'}
                                </Typography>
                                {` — Đăng ký: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Không có ngày'}`}
                              </>
                            }
                          />
                        </ListItem>
                        {index < (recentActivity.recentUsers.length - 1) && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                      Không có người dùng mới
                    </Typography>
                  )}
                </List>
              </Paper>
            </Box>
          </>
        )}
      </Container>
    </AdminLayout>
  );
};

export default Dashboard; 