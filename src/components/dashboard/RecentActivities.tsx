import React from 'react';
import { Link } from 'react-router-dom';
import type {DailyTransaction} from '../../types';

interface RecentActivitiesProps {
  activities: DailyTransaction[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  loading,
  formatCurrency
}) => {
  return (
    <div className="mx-2 sm:mx-0">
      <div className="flex items-center justify-between mb-3 px-2 sm:px-0">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Atividades Recentes</h2>
        <Link
          to="/client/transactions"
          className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Ver todas
        </Link>
      </div>

      {loading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-4 text-center sm:p-6">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Carregando atividades...</p>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="text-center py-8 px-4 sm:py-12">
            <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-900">Nenhuma atividade recente</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Suas transações aparecerão aqui.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id} className="px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                      activity.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.date ? new Date(activity.date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                        {activity.category?.name && (
                          <span className="hidden sm:inline"> • {activity.category.name}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className={`text-xs sm:text-sm font-medium ${
                      activity.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.type === 'income' ? '+' : '-'}{formatCurrency(Number(activity.amount))}
                    </p>
                    <p className="text-xs text-gray-500 sm:hidden">
                      {activity.category?.name || ''}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
