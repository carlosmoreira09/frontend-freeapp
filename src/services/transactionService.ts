import api from './api';
import type { TransactionType } from '../types/transaction';

interface CreateTransactionPayload {
  description: string;
  amount: number;
  type: string; // Using TransactionType enum values: 'income' or 'expense'
  categoryId: string;
  date: string; // ISO8601 formatted date string
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction service
const transactionService = {
  // Create a new transaction
  createTransaction: async (data: CreateTransactionPayload): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  // Get user transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
  },
};

export default transactionService;
