/**
 * Transaction related types
 */
import type {AdminClientData} from "./admin.ts";
import type {Category} from "./category.ts";

// Transaction type enum
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

// Daily transaction interface
export interface DailyTransaction {
  id?: string;
  description: string;
  amount: number;
  type: TransactionType;
  date?: string;
  client?: AdminClientData
  clientId?: string;
  clientName?: string;
  category?: Category;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Daily transaction filters
export interface DailyTransactionFilters {
  clientId?: string;
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
}

// Transaction summary
export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
}

// Transaction category
export interface TransactionCategory {
  id: string;
  name: string;
  description?: string;
  type: TransactionType;
}
