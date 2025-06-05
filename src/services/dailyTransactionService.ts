import api from './api';
import type {DailyTransaction, DailyTransactionFilters} from '../types';

// Daily Transaction service
const dailyTransactionService = {


  getAllDailyTransactions: async () => {
    const response = await api.get(`/daily-transactions`)
    return response.data
  },

  // Get daily transactions for a specific client
  getClientTransactions: async (
    clientId: string,
    page = 1,
    limit = 10,
    filters: Omit<DailyTransactionFilters, 'clientId'> = {}
  ): Promise<{ transactions: DailyTransaction[], pagination: any }> => {
    const { startDate, endDate, type } = filters;
    
    let url = `/daily-transactions/client/${clientId}?page=${page}&limit=${limit}`;
    
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (type) url += `&type=${type}`;
    
    const response = await api.get(url);
    return response.data;
  },

  createDailyTransaction: async (data: DailyTransaction) => {
    const response = await api.post(`/daily-transactions`, data)
    return response.data
  },

  // Get daily transactions for a specific date range
  getTransactionsByDateRange: async (
    startDate: string,
    endDate: string,
    page = 1,
    limit = 10,
    clientId?: string
  ): Promise<{ transactions: DailyTransaction[], pagination: any }> => {
    let url = `/daily-transactions/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
    
    if (clientId) url += `&clientId=${clientId}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get transaction summary by client
  getTransactionSummaryByClient: async (
    clientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ income: number, expense: number, balance: number }> => {
    let url = `/clients/${clientId}/daily-transactions`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

};

export default dailyTransactionService;
