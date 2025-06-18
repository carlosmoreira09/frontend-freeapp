import React from 'react';

interface DailyBudgetStatusProps {
  dailyBudget: number;
  remainingBalance: number;
  todaySpent: number;
  formatCurrency: (amount: number) => string;
  getBalanceColor: (balance: number) => string;
  getBalanceIcon: (balance: number) => string;
}

const Dailytatus: React.FC<DailyBudgetStatusProps> = ({
  dailyBudget,
  remainingBalance,
  todaySpent,
  formatCurrency,
  getBalanceColor,
  getBalanceIcon
}) => {
  return (
    <div className="space-y-2">
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Orçamento Diário</dt>
          <dd className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-gray-900">{formatCurrency(dailyBudget)}</dd>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Saldo Restante</dt>
          <dd className={`mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold ${getBalanceColor(remainingBalance)}`}>
            {formatCurrency(remainingBalance)} 
            <span className="text-base sm:text-lg ml-1">{getBalanceIcon(remainingBalance)}</span>
          </dd>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-red-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Gasto Hoje</dt>
          <dd className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-red-600">{formatCurrency(todaySpent)}</dd>
        </div>
      </div>
    </div>
  );
};

export default Dailytatus;
