import axios, {type AxiosInstance } from 'axios';
import { setupInterceptors } from '../interceptors';

// Define the base URL for API requests
export const API_URL = "https://freeapp.com.br/api";

/**
 * Creates and configures a new axios instance with all interceptors applied
 * @param baseURL Optional custom base URL (defaults to API_URL)
 * @returns Configured axios instance
 */
export const createAPI = (baseURL: string = API_URL): AxiosInstance => {
  // Create axios instance with default config
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Apply all interceptors
  setupInterceptors(api);

  return api;
};

// Create default API instance
const api = createAPI();

export default api;
