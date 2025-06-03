import type {AxiosInstance} from 'axios';
import { setupAuthInterceptor } from './authInterceptor';
import { setupErrorInterceptor } from './errorInterceptor';

/**
 * Sets up all interceptors for an axios instance
 * @param api The axios instance to set up interceptors for
 * @returns The axios instance with all interceptors applied
 */
export const setupInterceptors = (api: AxiosInstance): AxiosInstance => {
  // Apply interceptors in the correct order
  setupAuthInterceptor(api);
  setupErrorInterceptor(api);
  
  return api;
};
