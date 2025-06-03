import {type AxiosInstance, AxiosError } from 'axios';

/**
 * Adds error handling interceptor to an axios instance
 * @param api The axios instance to add the interceptor to
 * @returns The axios instance with the interceptor added
 */
export const setupErrorInterceptor = (api: AxiosInstance): AxiosInstance => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle different error status codes
      if (error.response) {
        const { status } = error.response;
        
        // Handle authentication errors
        if (status === 401) {
          // Clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authType');
          localStorage.removeItem('user');
          localStorage.removeItem('client');
          
          // If not already on login page, redirect
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        // Handle forbidden errors
        if (status === 403) {
          console.error('Access forbidden');
        }
        
        // Handle not found errors
        if (status === 404) {
          console.error('Resource not found');
        }
        
        // Handle server errors
        if (status >= 500) {
          console.error('Server error occurred');
        }
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Network error - no response received');
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};
