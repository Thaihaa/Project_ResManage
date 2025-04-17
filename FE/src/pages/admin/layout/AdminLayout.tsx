import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Container, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Chiều rộng của sidebar
  const drawerWidth = 250;
  
  // Mở/đóng sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            Quản trị hệ thống
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <AdminSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        drawerWidth={drawerWidth}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Để không bị che bởi AppBar
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout; 