import api from './api';
import {
  type User,
  type Client,
  type LoginCredentials,
  type RegisterUserData,
  type AuthResponse,
  AuthType
} from '../types';
import axios from "axios";

// Authentication service
const authService = {
  // Login user or client
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('authType', response.data.type);
      
      if (response.data.user) {
        localStorage.setItem('admin', JSON.stringify(response.data.user));
      } else if (response.data.client) {
        localStorage.setItem('client', JSON.stringify(response.data.client));
      }
    }
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterUserData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authType');
    localStorage.removeItem('admin');
    localStorage.removeItem('client');
  },

  // Get current authenticated user/client
  getCurrentUser: () => {
    const authType = localStorage.getItem('authType');
    if (authType === AuthType.ADMIN) {
      const userStr = localStorage.getItem('admin');
      return userStr ? JSON.parse(userStr) : null;
    } else if (authType === AuthType.CLIENT) {
      const clientStr = localStorage.getItem('client');
      return clientStr ? JSON.parse(clientStr) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Change password
  changePassword: async (email: string, currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      email,
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: Partial<User | Client>): Promise<User | Client> => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Profile update failed');
      }
      throw new Error('Network error during profile update');
    }
  }
};

export default authService;
