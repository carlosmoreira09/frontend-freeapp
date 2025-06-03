
import type {Client} from './auth';
import { MaritalStatus } from './enum';

export interface AdminClientData extends Client {
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  totalTransactions?: number;
  balance?: number;
  cpf: string;
  birthday?: string;
  age?: number;
  salary?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  complement?: string;
  maritalStatus?: MaritalStatus;
  isActive?: boolean;
  managerId?: string;
}

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
