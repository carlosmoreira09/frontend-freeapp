export interface MonthlyBudget {
  id: string;
  year: number;
  month: number;
  monthlySalary: number;
  budgetAmount: number;
  isPercentage: boolean;
  dailyBudget: number;
  remainingBalance: number;
  daysInMonth: number;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyBudgetFormData {
  monthlySalary: number;
  budgetAmount: number;
  isPercentage: boolean;
}

export interface MonthlyBudgetWithClient extends MonthlyBudget {
  client: {
    id: string;
    name: string;
    email: string;
  };
}
