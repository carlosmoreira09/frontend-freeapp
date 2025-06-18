import React from 'react';
import { Link } from 'react-router-dom';

const QuickAccessCards: React.FC = () => {
  return (
    <div className="mb-6 mx-2 sm:mx-0">
      <h2 className="text-lg font-bold text-gray-900 mb-3 px-2 sm:px-0 sm:text-xl">Acesso Rápido</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        <Link to="/client/transactions" className="block hover:shadow-lg transition-shadow duration-300">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:px-4 sm:py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-500 rounded-md p-2 sm:p-3">
                  <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-5 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">Ver Transações</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">Visualizar todas as suas transações</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-orange-600 hover:text-orange-500">
                  Ver todas <span className="hidden sm:inline">as transações</span> <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/client/transactions/new" className="block hover:shadow-lg transition-shadow duration-300">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:px-4 sm:py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-2 sm:p-3">
                  <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-5 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">Nova Transação</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">Adicionar uma nova transação</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-orange-600 hover:text-orange-500">
                  Criar <span className="hidden sm:inline">transação</span> <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/client/profile" className="block hover:shadow-lg transition-shadow duration-300">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:px-4 sm:py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-2 sm:p-3">
                  <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-5 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">Meu Perfil</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">Gerenciar informações do perfil</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-orange-600 hover:text-orange-500">
                  Ver <span className="hidden sm:inline">perfil</span> <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickAccessCards;
