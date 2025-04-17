import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Link,
  Badge,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const pages = [
  { title: 'Ưu Đãi', path: '/uu-dai' },
  { title: 'Thực Đơn', path: '/thuc-don' },
  { title: 'Đặt Bàn', path: '/dat-ban' }
];

const Header: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [anchorElLocation, setAnchorElLocation] = useState<null | HTMLElement>(null);
  
  const { totalItems } = useCart();
  const { authState, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };
  
  const handleOpenLocationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLocation(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };
  
  const handleCloseLocationMenu = () => {
    setAnchorElLocation(null);
  };
  
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/dang-nhap');
  };
  
  const handleGoToAdmin = () => {
    handleCloseUserMenu();
    navigate('/admin');
  };

  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img 
              src="/manwah-logo.svg" 
              alt="Manwah" 
              style={{ height: '40px', margin: 'auto' }} 
            />
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img 
              src="/images/logo.png" 
              alt="Manwah" 
              style={{ height: '40px', margin: 'auto' }} 
            />
          </Typography>
          
          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'inherit', display: 'block', mx: 1 }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Right Icons - Location */}
          <Box sx={{ mr: 2 }}>
            <Tooltip title="Vị trí cửa hàng">
              <IconButton 
                onClick={handleOpenLocationMenu} 
                size="small" 
                sx={{ 
                  color: 'inherit',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                  } 
                }}
              >
                <LocationOnIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-location"
              anchorEl={anchorElLocation}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElLocation)}
              onClose={handleCloseLocationMenu}
            >
              <MenuItem 
                component={RouterLink} 
                to="/vi-tri-cua-hang"
                onClick={handleCloseLocationMenu}
              >
                <Typography variant="body2">Tất cả cửa hàng</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCloseLocationMenu}>
                <Typography variant="body2">Lê Thái Tổ - Hà Nội</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseLocationMenu}>
                <Typography variant="body2">Vincom Center - Hà Nội</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseLocationMenu}>
                <Typography variant="body2">Vincom Metropolis - Hà Nội</Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          {/* Right Icons - Language */}
          <Box sx={{ mr: 2 }}>
            <Tooltip title="Ngôn ngữ">
              <IconButton 
                onClick={handleOpenLangMenu} 
                size="small" 
                sx={{ 
                  color: 'inherit',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                  } 
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-lang"
              anchorEl={anchorElLang}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={handleCloseLangMenu}>
                <Typography variant="body2">Tiếng Việt</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseLangMenu}>
                <Typography variant="body2">English</Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          {/* Right Icons - Shopping Cart */}
          <Box sx={{ mr: 2 }}>
            <Tooltip title="Giỏ hàng">
              <IconButton 
                component={RouterLink}
                to="/cart"
                size="small" 
                sx={{ 
                  color: 'inherit',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                  } 
                }}
              >
                <Badge badgeContent={totalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Right Icons - User */}
          <Box>
            {authState.isAuthenticated ? (
              <>
                <Tooltip title="Tài khoản">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ width: 32, height: 32 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">Hồ sơ</Typography>
                  </MenuItem>
                  
                  {isAdmin() && (
                    <MenuItem onClick={handleGoToAdmin}>
                      <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">Quản trị</Typography>
                    </MenuItem>
                  )}
                  
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">Đăng xuất</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/dang-nhap"
                startIcon={<PersonOutlineIcon />}
                sx={{ color: 'inherit' }}
              >
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 