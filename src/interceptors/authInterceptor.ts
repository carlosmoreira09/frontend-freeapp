import {type AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  role: string;
  clientId?: string;
  iat: number;
  exp: number;
}

/**
 * Adds authentication interceptor to an axios instance
 * @param api The axios instance to add the interceptor to
 * @returns The axios instance with the interceptor added
 */
export const setupAuthInterceptor = (api: AxiosInstance): AxiosInstance => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // Decode the token to get the userId
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          if (decoded.userId) {
            // Add userId to headers for easier access in backend
            config.headers['X-User-ID'] = decoded.userId;
          }
        } catch (error) {
          console.error('Error decoding JWT token:', error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};
