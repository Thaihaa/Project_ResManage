import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { LoginCredentials, RegisterCredentials, User } from '../types';

// Định nghĩa kiểu cho người dùng
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Định nghĩa kiểu cho AuthContext
interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Kiểm tra đăng nhập khi khởi tạo
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Kiểm tra xem có token trong localStorage không
        const isAuthenticated = authService.isAuthenticated();
        
        if (isAuthenticated) {
          // Lấy thông tin user từ localStorage
          const user = authService.getCurrentUser();
          
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Lỗi xác thực. Vui lòng đăng nhập lại.',
        });
      }
    };

    initAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const user = authService.getCurrentUser();
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Đăng nhập thất bại',
        }));
        
        return false;
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Lỗi không xác định',
      }));
      
      return false;
    }
  };

  // Hàm đăng ký
  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.register(credentials);
      
      if (response.success) {
        const user = authService.getCurrentUser();
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Đăng ký thất bại',
        }));
        
        return false;
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Lỗi không xác định',
      }));
      
      return false;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    authService.logout();
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  // Kiểm tra quyền admin
  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  // Context value
  const value = {
    authState,
    login,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 