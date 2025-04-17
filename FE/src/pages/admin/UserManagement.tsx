import React, { useEffect, useState, ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Snackbar,
  Alert,
  Grid,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { Search, Edit, Delete, Block, Check, PersonAdd } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import AdminLayout from './layout/AdminLayout';

const UserManagement: React.FC = () => {
  // State cho danh sách người dùng và phân trang
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State cho dialog xóa/vô hiệu hóa người dùng
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'delete' | 'deactivate' | 'activate'>('delete');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // State cho dialog thêm/chỉnh sửa người dùng
  const [openUserFormDialog, setOpenUserFormDialog] = useState(false);
  const [userFormMode, setUserFormMode] = useState<'add' | 'edit'>('add');
  const [userFormData, setUserFormData] = useState<{
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    password?: string;
  }>({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'User',
    isActive: true,
    password: ''
  });
  
  // State cho validate form
  const [userFormErrors, setUserFormErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
  }>({});
  
  // State cho thông báo
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Lấy danh sách người dùng khi component mount
  useEffect(() => {
    fetchUsers();
    console.log('UserManagement component mounted');
  }, []);
  
  // Lọc người dùng mỗi khi thay đổi các điều kiện lọc
  useEffect(() => {
    filterUsers();
    console.log('Filtering users with:', { searchTerm, roleFilter, statusFilter });
  }, [searchTerm, roleFilter, statusFilter, users]);
  
  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from API...');
      const response = await adminService.getAllUsers();
      console.log('API response:', response);
      
      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
        console.log('Users loaded successfully:', response.data.length);
        
        if (response.data.length === 0) {
          showSnackbar('Không có dữ liệu người dùng', 'info');
        }
      } else {
        // Hiển thị thông báo lỗi đầu tiên
        showSnackbar(`Không thể tải dữ liệu người dùng: ${response.message || 'Lỗi không xác định'}`, 'error');
        console.error('Failed to load users:', response.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Thông báo đang thử kết nối lại
      showSnackbar('Đang thử kết nối lại máy chủ...', 'info');
      
      try {
        // Chờ 2 giây rồi thử lại
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Thử lại lần thứ hai
        const retryResponse = await adminService.getAllUsers();
        
        if (retryResponse.success && retryResponse.data) {
          setUsers(retryResponse.data);
          setFilteredUsers(retryResponse.data);
          showSnackbar('Đã kết nối lại thành công', 'success');
          console.log('Users loaded successfully on retry:', retryResponse.data.length);
        } else {
          showSnackbar('Không thể kết nối đến máy chủ sau nhiều lần thử', 'error');
        }
      } catch (retryError) {
        console.error('Error on retry:', retryError);
        showSnackbar('Lỗi kết nối đến máy chủ', 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm lọc người dùng theo điều kiện tìm kiếm và lọc
  const filterUsers = () => {
    let result = [...users];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      result = result.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm)
      );
    }
    
    // Lọc theo vai trò
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter(user => user.isActive === isActive);
    }
    
    setFilteredUsers(result);
  };
  
  // Xử lý thay đổi trang
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Xử lý thay đổi số dòng trên một trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Mở dialog xóa/vô hiệu hóa
  const handleOpenDialog = (user: User, type: 'delete' | 'deactivate' | 'activate') => {
    setSelectedUser(user);
    setDialogType(type);
    setOpenDialog(true);
  };
  
  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Xác nhận thao tác trong dialog
  const handleConfirmDialog = async () => {
    if (!selectedUser) return;
    
    try {
      let success = false;
      let message = '';
      
      // Gọi API tương ứng với loại thao tác
      if (dialogType === 'delete') {
        // Xóa người dùng
        const response = await adminService.deleteUser(selectedUser.userId);
        success = response.success;
        message = response.message || 'Đã xóa người dùng thành công';
        
        if (success) {
          // Cập nhật lại danh sách người dùng
          setUsers(users.filter(user => user.userId !== selectedUser.userId));
        }
      } else if (dialogType === 'deactivate') {
        // Vô hiệu hóa người dùng
        const response = await adminService.updateUserStatus(selectedUser.userId, false);
        success = response.success;
        message = response.message || 'Đã vô hiệu hóa người dùng thành công';
        
        if (success) {
          // Cập nhật lại danh sách người dùng
          setUsers(users.map(user => 
            user.userId === selectedUser.userId ? {...user, isActive: false} : user
          ));
        }
      } else if (dialogType === 'activate') {
        // Kích hoạt người dùng
        const response = await adminService.updateUserStatus(selectedUser.userId, true);
        success = response.success;
        message = response.message || 'Đã kích hoạt người dùng thành công';
        
        if (success) {
          // Cập nhật lại danh sách người dùng
          setUsers(users.map(user => 
            user.userId === selectedUser.userId ? {...user, isActive: true} : user
          ));
        }
      }
      
      if (success) {
        showSnackbar(message, 'success');
      } else {
        showSnackbar(message || 'Thao tác không thành công', 'error');
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      showSnackbar('Đã xảy ra lỗi', 'error');
    } finally {
      handleCloseDialog();
    }
  };
  
  // Hiển thị thông báo
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Đóng thông báo
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // Hiển thị trạng thái người dùng dưới dạng chip
  const renderUserStatus = (isActive: boolean) => {
    return isActive ? (
      <Chip 
        label="Đang hoạt động" 
        color="success" 
        size="small" 
        icon={<Check />} 
      />
    ) : (
      <Chip 
        label="Bị vô hiệu hóa" 
        color="error" 
        size="small" 
        icon={<Block />} 
      />
    );
  };

  // Mở dialog thêm người dùng mới
  const handleAddUser = () => {
    setUserFormMode('add');
    setUserFormData({
      username: '',
      email: '',
      fullName: '',
      phoneNumber: '',
      role: 'User',
      isActive: true,
      password: ''
    });
    setUserFormErrors({});
    setOpenUserFormDialog(true);
  };
  
  // Mở dialog chỉnh sửa thông tin người dùng
  const handleEditUser = (user: User) => {
    setUserFormMode('edit');
    setUserFormData({
      username: user.username || '',
      email: user.email || '',
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'User',
      isActive: user.isActive
    });
    setUserFormErrors({});
    setSelectedUser(user);
    setOpenUserFormDialog(true);
  };
  
  // Đóng dialog form
  const handleCloseUserFormDialog = () => {
    setOpenUserFormDialog(false);
  };
  
  // Cập nhật dữ liệu form người dùng - TextField handler
  const handleUserFormChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const name = event.target.name as string;
    const value = event.target.value;
    
    setUserFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value
    }));
    
    // Xóa lỗi khi người dùng điền vào trường
    if (userFormErrors[name as keyof typeof userFormErrors]) {
      setUserFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handler cho Select component
  const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    const name = event.target.name as string;
    const value = event.target.value;
    
    setUserFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value
    }));
    
    // Xóa lỗi khi người dùng điền vào trường
    if (userFormErrors[name as keyof typeof userFormErrors]) {
      setUserFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Validate form dữ liệu
  const validateUserForm = (): boolean => {
    const errors: {
      username?: string;
      email?: string;
      password?: string;
      phoneNumber?: string;
    } = {};
    
    if (!userFormData.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống';
    }
    
    if (!userFormData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userFormData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (userFormMode === 'add' && (!userFormData.password || userFormData.password.length < 6)) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (userFormData.phoneNumber && !/^\d{10,11}$/.test(userFormData.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Lưu thông tin người dùng (thêm mới hoặc cập nhật)
  const handleSaveUser = async () => {
    if (!validateUserForm()) {
      return;
    }
    
    try {
      if (userFormMode === 'add') {
        // Thêm người dùng mới
        const response = await adminService.createUser({
          username: userFormData.username,
          email: userFormData.email,
          fullName: userFormData.fullName,
          phoneNumber: userFormData.phoneNumber,
          role: userFormData.role,
          isActive: userFormData.isActive,
          password: userFormData.password
        });
        
        if (response.success) {
          showSnackbar('Thêm người dùng mới thành công', 'success');
          setUsers(prev => [...prev, response.data]);
          setOpenUserFormDialog(false);
        } else {
          showSnackbar(response.message || 'Lỗi khi thêm người dùng mới', 'error');
        }
      } else if (userFormMode === 'edit' && selectedUser) {
        // Cập nhật thông tin người dùng
        const response = await adminService.updateUser(selectedUser.userId, {
          username: userFormData.username,
          email: userFormData.email,
          fullName: userFormData.fullName,
          phoneNumber: userFormData.phoneNumber,
          role: userFormData.role,
          isActive: userFormData.isActive
        });
        
        if (response.success) {
          showSnackbar('Cập nhật thông tin người dùng thành công', 'success');
          setUsers(prev => prev.map(user => 
            user.userId === selectedUser.userId ? response.data : user
          ));
          setOpenUserFormDialog(false);
        } else {
          showSnackbar(response.message || 'Lỗi khi cập nhật thông tin người dùng', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Đã xảy ra lỗi', 'error');
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý người dùng
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<PersonAdd />}
            onClick={handleAddUser}
          >
            Thêm người dùng
          </Button>
        </Box>
        
        {/* Thanh tìm kiếm và lọc */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, minWidth: '200px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <Search color="action" />
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={roleFilter}
                label="Vai trò"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">Người dùng</MenuItem>
                <MenuItem value="Staff">Nhân viên</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Đã vô hiệu hóa</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
        
        {/* Bảng danh sách người dùng */}
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên đăng nhập</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày đăng ký</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">Đang tải dữ liệu...</TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">Không tìm thấy dữ liệu người dùng</TableCell>
                  </TableRow>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <TableRow key={`user-${user.userId || index}`}>
                        <TableCell>{user.userId}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
                            {user.username || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell>{user.fullName || '-'}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>{user.phoneNumber || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role || 'User'} 
                            color={user.role === 'Admin' ? 'primary' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{renderUserStatus(user.isActive)}</TableCell>
                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="primary" size="small" title="Chỉnh sửa"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            
                            {user.isActive ? (
                              <IconButton 
                                color="warning" 
                                size="small"
                                title="Vô hiệu hóa" 
                                onClick={() => handleOpenDialog(user, 'deactivate')}
                              >
                                <Block fontSize="small" />
                              </IconButton>
                            ) : (
                              <IconButton 
                                color="success" 
                                size="small"
                                title="Kích hoạt" 
                                onClick={() => handleOpenDialog(user, 'activate')}
                              >
                                <Check fontSize="small" />
                              </IconButton>
                            )}
                            
                            <IconButton 
                              color="error" 
                              size="small"
                              title="Xóa" 
                              onClick={() => handleOpenDialog(user, 'delete')}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </Paper>
      </Container>
      
      {/* Dialog xác nhận */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {dialogType === 'delete' ? 'Xác nhận xóa người dùng' : 
           dialogType === 'deactivate' ? 'Xác nhận vô hiệu hóa người dùng' : 
           'Xác nhận kích hoạt người dùng'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'delete' ? 
              `Bạn có chắc chắn muốn xóa người dùng ${selectedUser?.username || ''} không? Thao tác này không thể hoàn tác.` : 
             dialogType === 'deactivate' ? 
              `Bạn có chắc chắn muốn vô hiệu hóa người dùng ${selectedUser?.username || ''} không? Người dùng sẽ không thể đăng nhập vào hệ thống.` : 
              `Bạn có chắc chắn muốn kích hoạt lại người dùng ${selectedUser?.username || ''} không?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmDialog} 
            color={dialogType === 'delete' ? 'error' : dialogType === 'deactivate' ? 'warning' : 'success'} 
            variant="contained"
            autoFocus
          >
            {dialogType === 'delete' ? 'Xóa' : dialogType === 'deactivate' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog thêm/chỉnh sửa người dùng */}
      <Dialog
        open={openUserFormDialog}
        onClose={handleCloseUserFormDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {userFormMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa thông tin người dùng'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ gridColumn: '1/7', gridRow: '1', margin: 1 }}>
              <TextField
                name="username"
                label="Tên đăng nhập"
                fullWidth
                value={userFormData.username}
                onChange={handleUserFormChange}
                error={!!userFormErrors.username}
                helperText={userFormErrors.username}
                disabled={userFormMode === 'edit'}
              />
            </Grid>
            <Grid sx={{ gridColumn: '7/13', gridRow: '1', margin: 1 }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={userFormData.email}
                onChange={handleUserFormChange}
                error={!!userFormErrors.email}
                helperText={userFormErrors.email}
              />
            </Grid>
            {userFormMode === 'add' && (
              <Grid sx={{ gridColumn: '1/13', gridRow: '2', margin: 1 }}>
                <TextField
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  fullWidth
                  value={userFormData.password || ''}
                  onChange={handleUserFormChange}
                  error={!!userFormErrors.password}
                  helperText={userFormErrors.password}
                />
              </Grid>
            )}
            <Grid sx={{ gridColumn: '1/7', gridRow: userFormMode === 'add' ? '3' : '2', margin: 1 }}>
              <TextField
                name="fullName"
                label="Họ tên"
                fullWidth
                value={userFormData.fullName}
                onChange={handleUserFormChange}
              />
            </Grid>
            <Grid sx={{ gridColumn: '7/13', gridRow: userFormMode === 'add' ? '3' : '2', margin: 1 }}>
              <TextField
                name="phoneNumber"
                label="Số điện thoại"
                fullWidth
                value={userFormData.phoneNumber}
                onChange={handleUserFormChange}
                error={!!userFormErrors.phoneNumber}
                helperText={userFormErrors.phoneNumber}
              />
            </Grid>
            <Grid sx={{ gridColumn: '1/7', gridRow: userFormMode === 'add' ? '4' : '3', margin: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="role"
                  value={userFormData.role}
                  label="Vai trò"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">Người dùng</MenuItem>
                  <MenuItem value="Staff">Nhân viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ gridColumn: '7/13', gridRow: userFormMode === 'add' ? '4' : '3', margin: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="isActive"
                  value={userFormData.isActive.toString()}
                  label="Trạng thái"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="true">Đang hoạt động</MenuItem>
                  <MenuItem value="false">Bị vô hiệu hóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserFormDialog}>
            Hủy
          </Button>
          <Button 
            onClick={handleSaveUser}
            variant="contained" 
            color="primary"
          >
            {userFormMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default UserManagement; 