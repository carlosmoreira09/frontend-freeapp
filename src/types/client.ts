/**
 * Client related types
 */
/**
 * Client related types
 */
import type {Client} from './auth';

// Client transaction interface
export interface ClientTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
}

// Extended client profile interface
export interface ClientProfile extends Client {
  profileImage?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Client dashboard data
export interface ClientDashboardData {
  accountBalance: number;
  totalTransactions: number;
  pendingTransactions: number;
  recentActivity: Array<{
    id: string;
    date: string;
    description: string;
    type: string;
  }>;
}
