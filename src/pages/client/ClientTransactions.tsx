import React, { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { Link } from 'react-router-dom';
import {api, type DailyTransaction} from "../../services";
import {toast} from "react-hot-toast";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {formatCurrency} from "../../lib/utils.ts";


const ClientTransactions: React.FC = () => {
  const { client } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<DailyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/daily-transactions/client/${client?.id}`);
        if(response.data) {
          const transactions: DailyTransaction[] = response.data.transactions || [];
          setRecentActivities(transactions)
        } else  {
          toast.error('Erro ao carregar transações do cliente.');

        }
      } catch (err) {
        setError(err as string)
        toast.error('Erro ao carregar transações do cliente: ' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats().then();
  }, [client?.id]);

  const getStatusText = (status: string | undefined): string => {
    if(!status) return ''
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-600">
          <div className="px-4 py-6 sm:px-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Suas Transações</h1>
            <Link
              to="/client/add-transaction"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
              Nova Transação
            </Link>
          </div>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-orange-500">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando transações...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Descrição
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Valor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider hidden sm:table-cell"
                    >
                      Categoria
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhuma transação encontrada.
                      </td>
                    </tr>
                  ) : (
                      recentActivities.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-orange-50 transition-colors duration-150">
                        <td className="px-2 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString('pt-BR') : 'Sem Registro'}
                        </td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                          <span
                            className={`${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {transaction.type === 'expense' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          >
                            {getStatusText(transaction?.category?.name)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction Summary */}
        {!loading && !error && recentActivities.length > 0 && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg border-l-4 border-orange-400">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Resumo de Transações</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-orange-50 overflow-hidden shadow rounded-md p-4">
                  <div className="text-sm font-medium text-orange-700">Total de Créditos</div>
                  <div className="mt-1 text-2xl font-semibold text-green-600">
                    {formatCurrency(
                        recentActivities
                        .filter(t => t.type === 'income')
                        .reduce((sum, t) => sum + Number(t.amount), 0)
                    )}
                  </div>
                </div>
                <div className="bg-orange-50 overflow-hidden shadow rounded-md p-4">
                  <div className="text-sm font-medium text-orange-700">Total de Débitos</div>
                  <div className="mt-1 text-2xl font-semibold text-red-600">
                    {formatCurrency(
                        recentActivities
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + Number(t.amount), 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientTransactions;
