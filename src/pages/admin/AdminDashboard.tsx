import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {api} from "../../services";
import {formatCurrency, formatDate, getActivityStatusClass} from "../../lib/utils.ts";

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  pendingApprovals: number;
  systemStatus: 'operational' | 'maintenance' | 'degraded';
  lastLoginDate: string;
}

export interface RecentActivity {
  type: 'transaction' | 'registration' | 'system';
  clientId?: string;
  clientName?: string;
  description: string;
  amount?: number;
  transactionType?: 'income' | 'expense';
  date: string;
  client: any;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/clients/stats/dashboard');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      }
    };

    const fetchRecentActivities = async () => {
      try {
        setActivitiesLoading(true);
        const response = await api.get('/clients/stats/recent-activities');
        setRecentActivities(response.data);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
      } finally {
        setActivitiesLoading(false);

      }
    };

    fetchDashboardStats().then();
    fetchRecentActivities().then();
  }, []);


  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-600">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}</h1>
            <p className="mt-1 text-sm text-orange-600">
              {loading ? 'Carregando seu painel...' : 
                `Último acesso: ${new Date(stats?.lastLoginDate || '').toLocaleString('pt-BR')}`}
            </p>
          </div>
        </header>

        {/* System Status */}
        {!loading && stats && (
          <div className="mb-6 bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-500">
            <div className="px-4 py-5 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Acesso Rapido</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/admin/clients/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                >
                  Adicionar Cliente
                </Link>
                <Link
                  to="/admin/settings"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                >
                  Gerenciar Configurações
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        {loading ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando seu painel...</p>
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Clientes</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.totalClients}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-orange-400 transition-all duration-300 hover:shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Clientes Ativos</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.activeClients}</dd>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Cards */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/clients" className="block hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Gerenciar Clientes</h3>
                    <p className="mt-1 text-sm text-gray-500">Visualizar e gerenciar contas de clientes</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="font-medium text-orange-600 hover:text-orange-500">
                    Ver todos os clientes <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/transactions" className="block hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-400 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Transações Diárias</h3>
                    <p className="mt-1 text-sm text-gray-500">Visualizar e analisar transações</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="font-medium text-orange-600 hover:text-orange-500">
                    Ver transações <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/settings" className="block hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-600 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Configurações do Sistema</h3>
                    <p className="mt-1 text-sm text-gray-500">Configurar ajustes da aplicação</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="font-medium text-orange-600 hover:text-orange-500">
                    Gerenciar configurações <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="hidden bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-400 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
                  <p className="mt-1 text-sm text-gray-500">Visualizar relatórios e análises do sistema</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-orange-600 hover:text-orange-500">
                  Ver relatórios <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Atividades Recentes</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {activitiesLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando atividades recentes...</p>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Nenhuma atividade recente encontrada.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <li key={index} className="px-4 py-4 sm:px-6 hover:bg-orange-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-orange-600 truncate">
                      {activity.description}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivityStatusClass(activity.type, activity.transactionType)}`}>
                        {formatCurrency(activity.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {activity.client.name}
                        {activity.type === 'transaction' && activity.amount && (
                          <span className="ml-2 font-medium">{formatCurrency(activity.amount)}</span>
                        )}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p>
                        <time dateTime={activity.date}>{formatDate(activity.date)}</time>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
