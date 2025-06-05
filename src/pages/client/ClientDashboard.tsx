import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import {api, type DailyTransaction} from "../../services";
import {toast} from "react-hot-toast";

interface DashboardStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  lastLoginDate: string;
}

const ClientDashboard: React.FC = () => {
  const { client } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<DailyTransaction[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setActivitiesLoading(true)
        // Get transactions from API
        const response = await api.get(`/daily-transactions/client/${client?.id}`);
        if(response.data) {
          const transactions: DailyTransaction[] = response.data.transactions || [];
          setRecentActivities(transactions.slice(0,5))
          // Calculate stats from transactions
          let totalIncome = 0;
          let totalExpense = 0;

          transactions.forEach((transaction: DailyTransaction) => {
            if (transaction.type === 'income') {
              totalIncome += Number(transaction.amount);
            } else if (transaction.type === 'expense') {
              totalExpense += Number(transaction.amount);
            }
          });

          setStats({
            totalTransactions: transactions.length,
            totalIncome,
            totalExpense,
            lastLoginDate: new Date().toISOString(),
          });
        }
      } catch (err) {
        toast.error('Erro ao buscar estatísticas do painel: ' + err);
      } finally {
        setLoading(false);
        setActivitiesLoading(false)
      }
    };

    fetchDashboardStats().then();
  }, [client?.id]);


  const formatCurrency = (amount: number | undefined): string => {
    if(!amount)  return ''
      return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-500">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {client?.name}</h1>
            <p className="mt-1 text-sm text-orange-600">
              {loading ? 'Carregando seu painel...' : 
                `Último acesso: ${new Date(stats?.lastLoginDate || '').toLocaleString('pt-BR')}`}
            </p>
          </div>
        </header>

        {/* Stats Overview */}
        {loading ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando seu painel...</p>
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Transações</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-gray-900">{stats?.totalTransactions}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Receitas</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-green-600">
                  {formatCurrency(stats?.totalIncome) || 'R$ 0,00'}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-red-500 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Despesas</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-red-600">
                  {formatCurrency(stats?.totalExpense || 0)}
                </dd>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Cards - Only show on desktop */}
        <div className="hidden md:block">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/client/transactions" className="block hover:shadow-lg transition-shadow duration-300">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Transações</h3>
                      <p className="mt-1 text-sm text-gray-500">Visualize seu histórico de transações</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-orange-600 hover:text-orange-500">
                      Ver todas as transações <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/client/profile" className="block hover:shadow-lg transition-shadow duration-300">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-orange-400 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Perfil</h3>
                      <p className="mt-1 text-sm text-gray-500">Atualize suas informações pessoais</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-orange-600 hover:text-orange-500">
                      Editar perfil <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-600 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Ajuda & Suporte</h3>
                    <p className="mt-1 text-sm text-gray-500">Obtenha ajuda com sua conta</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="font-medium text-orange-600 hover:text-orange-500">
                    Contatar suporte <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
          {activitiesLoading ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando atividades recentes...</p>
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {recentActivities.slice(0, 5).map((activity: any) => (
                  <li key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-orange-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {activity.type === 'income' ? (
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          ) : (
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString('pt-BR')} • {activity.category?.name || 'Sem categoria'}
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex justify-center">
                  <Link 
                    to="/client/transactions" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Ver todas as transações
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-600">Nenhuma transação recente encontrada.</p>
              <div className="mt-4">
                <Link 
                  to="/client/transactions" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Gerenciar transações
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
