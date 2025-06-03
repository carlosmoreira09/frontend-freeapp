import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';

// Mock data for dashboard stats
interface DashboardStats {
  totalTransactions: number;
  pendingTransactions: number;
  accountBalance: number;
  lastLoginDate: string;
}

const ClientDashboard: React.FC = () => {
  const { client } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await api.get('/client/stats');
        // setStats(response.data);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalTransactions: 12,
          pendingTransactions: 2,
          accountBalance: 1250.75,
          lastLoginDate: new Date().toISOString(),
        });
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar estatísticas do painel:', err);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount: number): string => {
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
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Saldo da Conta</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-orange-600">
                  {formatCurrency(stats?.accountBalance || 0)}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total de Transações</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-gray-900">{stats?.totalTransactions}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Transações Pendentes</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-gray-900">{stats?.pendingTransactions}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Status da Conta</dt>
                <dd className="mt-1 text-xl sm:text-3xl font-semibold text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativa
                  </span>
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
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Atividade Recente</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6 hover:bg-orange-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-orange-600 truncate">Perfil atualizado</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Concluído
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Você atualizou suas informações de perfil
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6 hover:bg-orange-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-orange-600 truncate">Transação recebida</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Concluído
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Você recebeu {formatCurrency(350.00)} de João Silva
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    {new Date(Date.now() - 86400000).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6 hover:bg-orange-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-orange-600 truncate">Login detectado</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Informativo
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Novo login detectado em um dispositivo desconhecido
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    {new Date(Date.now() - 172800000).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
