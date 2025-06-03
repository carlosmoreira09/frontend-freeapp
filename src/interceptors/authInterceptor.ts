import {type AxiosInstance } from 'axios';

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
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};
