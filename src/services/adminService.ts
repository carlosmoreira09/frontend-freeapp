import api from './api';
import type {AdminClientData, SystemSettings, AdminDashboardData} from '../types';

// Admin service
const adminService = {
  // Get all clients
  getClients: async (page = 1, limit = 10, search = '', status = ''): Promise<{ clients: AdminClientData[], pagination: any }> => {
    const response = await api.get<{ clients: AdminClientData[], pagination: any }>(
      `/clients?page=${page}&limit=${limit}&search=${search}${status ? `&status=${status}` : ''}`
    );
    return response.data;
  },

  // Get client by ID
  getClient: async (id: string): Promise<AdminClientData> => {
    const response = await api.get<AdminClientData>(`/clients/${id}`);
    return response.data;
  },

  // Create new client
  createClient: async (client: Omit<AdminClientData, 'id' | 'createdAt' | 'status'>): Promise<AdminClientData> => {
    // Use the /clients endpoint which expects the userId from the JWT token
    const response = await api.post<AdminClientData>('/clients', client);
    return response.data;
  },

  // Update client
  updateClient: async (id: string, client: Partial<AdminClientData>): Promise<AdminClientData> => {
    const response = await api.put<AdminClientData>(`/clients/${id}`, client);
    return response.data;
  },

  // Delete client
  deleteClient: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  // Get system settings
  getSettings: async (): Promise<SystemSettings> => {
    const response = await api.get<SystemSettings>('/settings');
    return response.data;
  },

  // Update system settings
  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await api.put<SystemSettings>('/admin/settings', settings);
    return response.data;
  },

  // Get admin dashboard data
  getDashboardData: async (): Promise<AdminDashboardData> => {
    const response = await api.get<AdminDashboardData>('/admin/dashboard');
    return response.data;
  },
};

export default adminService;
