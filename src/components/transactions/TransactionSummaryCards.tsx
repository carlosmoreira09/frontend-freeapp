import React from 'react';
import type {TransactionSummary} from "../../types";

interface TransactionSummaryCardsProps {
  summary: TransactionSummary;
  loading: boolean;
}

const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({ summary, loading }) => {

  const formatCurrency = (amount: number) => {

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);

  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {/* Income Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Total de Receitas</dt>
              {loading ? (
                <dd className="flex items-center text-lg font-medium text-gray-900">
                  <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
                </dd>
              ) : (
                <dd className="text-lg font-medium text-gray-900">{formatCurrency(summary.income)}</dd>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-red-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Total de Despesas</dt>
              {loading ? (
                <dd className="flex items-center text-lg font-medium text-gray-900">
                  <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
                </dd>
              ) : (
                <dd className="text-lg font-medium text-gray-900">{Number(formatCurrency(summary.expense)) ? formatCurrency(summary.expense) : formatCurrency(0)}</dd>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-500 transition-all duration-300 hover:shadow-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Saldo</dt>
              {loading ? (
                <dd className="flex items-center text-lg font-medium text-gray-900">
                  <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
                </dd>
              ) : (
                <dd className={`text-lg font-medium ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(formatCurrency(summary.balance)) ? formatCurrency(summary.balance) : formatCurrency(0)}
                </dd>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummaryCards;
