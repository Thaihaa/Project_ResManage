import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box,
  Typography
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Restaurant as RestaurantIcon, 
  TableBar as TableIcon, 
  MenuBook as MenuIcon, 
  EventNote as ReservationIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose, drawerWidth }) => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/dang-nhap';
  };
  
  // Kiểm tra đường dẫn hiện tại để highlight menu đang active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // CSS cho menu item
  const getMenuItemStyle = (path: string) => {
    return {
      borderRadius: '8px',
      my: 0.5,
      color: isActive(path) ? 'primary.main' : 'text.primary',
      bgcolor: isActive(path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
      '&:hover': {
        bgcolor: isActive(path) ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
      }
    };
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        display: { xs: 'block', sm: 'block' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: drawerWidth,
          bgcolor: 'background.paper',
          boxShadow: 1
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            QLNhaHang Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.fullName || currentUser?.username || 'Admin'}
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Menu Items */}
        <List component="nav" sx={{ px: 1, flexGrow: 1 }}>
          {/* Dashboard */}
          <ListItem 
            component={NavLink} 
            to="/admin/dashboard" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/dashboard')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/dashboard') ? 'primary.main' : 'inherit' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Bảng điều khiển" />
          </ListItem>
          
          {/* User Management */}
          <ListItem 
            component={NavLink} 
            to="/admin/users" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/users')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/users') ? 'primary.main' : 'inherit' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý người dùng" />
          </ListItem>
          
          {/* Restaurant Management */}
          <ListItem 
            component={NavLink} 
            to="/admin/restaurants" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/restaurants')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/restaurants') ? 'primary.main' : 'inherit' }}>
              <RestaurantIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý nhà hàng" />
          </ListItem>
          
          {/* Table Management */}
          <ListItem 
            component={NavLink} 
            to="/admin/tables" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/tables')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/tables') ? 'primary.main' : 'inherit' }}>
              <TableIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý bàn" />
          </ListItem>
          
          {/* Menu Management */}
          <ListItem 
            component={NavLink} 
            to="/admin/menus" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/menus')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/menus') ? 'primary.main' : 'inherit' }}>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý thực đơn" />
          </ListItem>
          
          {/* Reservation Management */}
          <ListItem 
            component={NavLink} 
            to="/admin/reservations" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/reservations')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/reservations') ? 'primary.main' : 'inherit' }}>
              <ReservationIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý đặt bàn" />
          </ListItem>
          
          {/* Settings */}
          <ListItem 
            component={NavLink} 
            to="/admin/settings" 
            onClick={onClose}
            sx={getMenuItemStyle('/admin/settings')}
          >
            <ListItemIcon sx={{ color: isActive('/admin/settings') ? 'primary.main' : 'inherit' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Cài đặt" />
          </ListItem>
        </List>
        
        <Divider />
        
        {/* Logout */}
        <List component="nav" sx={{ px: 1 }}>
          <ListItem 
            onClick={handleLogout} 
            sx={{ borderRadius: '8px', my: 0.5 }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar; 