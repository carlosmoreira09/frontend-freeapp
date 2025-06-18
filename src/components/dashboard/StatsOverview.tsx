import React from 'react';

interface StatsOverviewProps {
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  formatCurrency: (amount: number) => string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalTransactions,
  totalIncome,
  totalExpense,
  formatCurrency
}) => {
  return (
    <div className="space-y-2">
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Transações</dt>
          <dd className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-gray-900">{totalTransactions}</dd>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Receitas</dt>
          <dd className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-green-600">{formatCurrency(totalIncome)}</dd>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-red-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Despesas</dt>
          <dd className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-red-600">{formatCurrency(totalExpense)}</dd>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
