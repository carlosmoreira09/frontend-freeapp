/**
 * Admin related types
 */
/**
 * Admin related types
 */
import type {Client} from './auth';

// Admin client data interface
export interface AdminClientData extends Client {
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  totalTransactions?: number;
  balance?: number;
}

// System settings interface
export interface SystemSettings {
  siteName: string;
  contactEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  enableNotifications: boolean;
  currency: string;
  dateFormat: string;
  timeZone: string;
}

// Admin dashboard data
export interface AdminDashboardData {
  systemStatus: {
    api: 'online' | 'offline' | 'degraded';
    database: 'online' | 'offline' | 'degraded';
    storage: 'online' | 'offline' | 'degraded';
  };
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  pendingApprovals: number;
  recentActivity: Array<{
    id: string;
    date: string;
    description: string;
    type: string;
  }>;
}
