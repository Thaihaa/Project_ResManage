// Auth types
export interface User {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  password?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  // Frontend format
  success?: boolean;
  message?: string;
  // .NET Backend format (Pascal case)
  IsSuccess?: boolean;
  Message?: string;
  Token?: string;
  Username?: string;
  Email?: string;
  Role?: string;
  // Additional fields
  token?: string;
  username?: string;
  email?: string;
  role?: string;
}

// Restaurant types
export interface Restaurant {
  restaurantId: number;
  name: string;
  address: string;
  phoneNumber?: string;
  image?: string;
  rating: number;
  openTime: string;
  closeTime: string;
  description?: string;
  isActive: boolean;
}

export interface RestaurantDetail extends Restaurant {
  tables: Table[];
}

export interface Table {
  tableId: number;
  name: string;
  capacity: number;
  location?: string;
  description?: string;
  isAvailable: boolean;
}

// Reservation types
export interface Reservation {
  reservationId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  contactPhone?: string;
  notes?: string;
  status: string;
  createdAt: string;
  userId?: number;
  userName?: string;
  restaurantId: number;
  restaurantName: string;
  tableId: number;
  tableName: string;
}

export interface ReservationForm {
  restaurantId: number;
  tableId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  contactPhone?: string;
  notes?: string;
}

// Admin dashboard types
export interface DashboardSummary {
  totalRestaurants: number;
  totalTables: number;
  totalUsers: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  completedReservations: number;
}

export interface DailyReservation {
  date: string;
  totalReservations: number;
}

export interface RestaurantReservationCount {
  restaurantId: number;
  restaurantName: string;
  reservationCount: number;
}

export interface ReservationStatistics {
  dailyReservations: DailyReservation[];
  restaurantReservations: RestaurantReservationCount[];
}

export interface RecentReservation {
  reservationId: number;
  userName: string;
  restaurantName: string;
  reservationDate: string;
  status: string;
  createdAt: string;
}

export interface RecentUser {
  userId: number;
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
}

export interface RecentActivity {
  recentReservations: RecentReservation[];
  recentUsers: RecentUser[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
} 