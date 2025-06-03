import api from './api';
import type {ClientTransaction, ClientProfile, ClientDashboardData} from '../types';

// Client service
const clientService = {
  // Get client profile
  getProfile: async (): Promise<ClientProfile> => {
    const response = await api.get<ClientProfile>('/client/profile');
    return response.data;
  },

  // Update client profile
  updateProfile: async (profileData: Partial<ClientProfile>): Promise<ClientProfile> => {
    const response = await api.put<ClientProfile>('/client/profile', profileData);
    return response.data;
  },

  // Get client transactions
  getTransactions: async (page = 1, limit = 10): Promise<{ transactions: ClientTransaction[], total: number }> => {
    const response = await api.get<{ transactions: ClientTransaction[], total: number }>(
      `/client/transactions?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get transaction by ID
  getTransaction: async (id: string): Promise<ClientTransaction> => {
    const response = await api.get<ClientTransaction>(`/client/transactions/${id}`);
    return response.data;
  },

  // Create new transaction
  createTransaction: async (transaction: Omit<ClientTransaction, 'id' | 'date' | 'status'>): Promise<ClientTransaction> => {
    const response = await api.post<ClientTransaction>('/client/transactions', transaction);
    return response.data;
  },

  // Get client dashboard data
  getDashboardData: async (): Promise<ClientDashboardData> => {
    const response = await api.get<ClientDashboardData>('/client/dashboard');
    return response.data;
  },
};

export default clientService;
