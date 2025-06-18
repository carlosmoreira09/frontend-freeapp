import api from './api';
import type { MonthlyBudget, MonthlyBudgetFormData, MonthlyBudgetWithClient } from '../types';

const monthlyBudgetService = {
  // Get all monthly budgets for admin (with client info)
  getAllForAdmin: async (): Promise<MonthlyBudgetWithClient[]> => {
    const response = await api.get<MonthlyBudgetWithClient[]>('/monthly-budgets');
    return response.data;
  },

  // Get monthly budgets by client ID (admin only)
  getByClientId: async (clientId: string): Promise<MonthlyBudget[]> => {
    const response = await api.get<MonthlyBudget[]>(`/monthly-budgets/clients/${clientId}`);
    return response.data;
  },

  // Get monthly budget by ID
  getById: async (id: string): Promise<MonthlyBudget> => {
    const response = await api.get<MonthlyBudget>(`/monthly-budgets/${id}`);
    return response.data;
  },

  // Get or create monthly budget for specific year/month
  getOrCreateByYearMonth: async (clientId: string, year: number, month: number): Promise<MonthlyBudget> => {
    const response = await api.get<MonthlyBudget>(`/monthly-budgets/clients/${clientId}/year/${year}/month/${month}`);
    return response.data;
  },

  // Update monthly salary
  updateMonthlySalary: async (id: string, monthlySalary: number): Promise<MonthlyBudget> => {
    const response = await api.patch<MonthlyBudget>(`/monthly-budgets/${id}/salary`, { monthlySalary });
    return response.data;
  },

  // Update budget amount
  updateBudgetAmount: async (id: string, budgetAmount: number, isPercentage: boolean): Promise<MonthlyBudget> => {
    const response = await api.patch<MonthlyBudget>(`/monthly-budgets/${id}/budget`, { 
      budgetAmount, 
      isPercentage 
    });
    return response.data;
  },

  // Get current daily budget status
  getCurrentDailyStatus: async (): Promise<{
    dailyBudget: number;
    remainingBalance: number;
    todaySpent: number;
    todayIncome: number;
    monthlyBudget: any;
  }> => {
    const response = await api.get('/monthly-budgets/daily-status');
    return response.data;
  },

  // Update monthly budget (admin only)
  updateForAdmin: async (id: string, data: Partial<MonthlyBudgetFormData>): Promise<MonthlyBudget> => {
    const response = await api.put<MonthlyBudget>(`/monthly-budgets/${id}`, data);
    return response.data;
  },

  // Delete monthly budget (admin only)
  deleteForAdmin: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/monthly-budgets/${id}`);
    return response.data;
  },
};

export default monthlyBudgetService;
