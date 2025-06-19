import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ClientLayout from '../../components/layout/ClientLayout';
import {api, type DailyTransaction, type MonthlyBudget, monthlyBudgetService} from "../../services";
import {toast} from "react-hot-toast";
import {DailyStatus, QuickAccessCards, RecentActivities, StatsOverview} from "../../components/dashboard";


interface DashboardStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  lastLoginDate: string;
}

interface DailyBudgetStatus {
  dailyBudget: number;
  remainingBalance: number;
  todaySpent: number;
  todayIncome: number;
  monthlyBudget: MonthlyBudget;
  adjustedDailyBudget: number;
  previousDayBalance: number;
}

const ClientDashboard: React.FC = () => {
  const { client } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyStatus, setDailyStatus] = useState<DailyBudgetStatus | null>(null);
  const [recentActivities, setRecentActivities] = useState<DailyTransaction[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setActivitiesLoading(true);
        
        // Fetch transactions for stats
        const response = await api.get(`/daily-transactions/client/${client?.id}`);
        if(response.data) {
          const transactions: DailyTransaction[] = response.data.transactions || [];
          setRecentActivities(transactions.slice(0,5));
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

        // Fetch daily budget status
        const dailyBudgetStatus = await monthlyBudgetService.getCurrentDailyStatus();
        setDailyStatus(dailyBudgetStatus);
      } catch (err) {
        toast.error('Erro ao buscar dados do painel: ' + err);
      } finally {
        setLoading(false);
        setActivitiesLoading(false);
      }
    };

    if (client?.id) {
      fetchDashboardData();
    }
  }, [client?.id]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  const getBalanceColor = (balance: number): string => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceIcon = (balance: number): string => {
    if (balance > 0) return '↗';
    if (balance < 0) return '↘';
    return '→';
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-6 px-2 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Bem-vindo, {client?.name || 'Cliente'}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Aqui está um resumo da sua atividade financeira
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-3 sm:gap-4 mx-2 sm:mx-0">
            {stats && (
              <StatsOverview totalExpense={stats.totalTransactions} totalIncome={stats.totalIncome}  totalTransactions={stats.totalTransactions} formatCurrency={formatCurrency} />
            )}

            {/* Daily Budget Status */}
            {dailyStatus ? (
                <>
                  <DailyStatus
                      remainingBalance={dailyStatus.remainingBalance}
                      formatCurrency={formatCurrency}
                      dailyBudget={dailyStatus.monthlyBudget.dailyBudget}
                      todaySpent={dailyStatus.todaySpent}
                      getBalanceColor={getBalanceColor}
                      getBalanceIcon={getBalanceIcon}/>
                </>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 text-center mx-2 sm:mx-0 mb-4">
                <p className="text-sm text-gray-600">Nenhum orçamento diário encontrado.</p>
              </div>
            )}
            </div>
            {/* Quick Access Cards - Compact Mobile Version */}
            <QuickAccessCards />

            {/* Recent Activities */}
            <div className="mx-2 sm:mx-0">
              {activitiesLoading ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="p-4 text-center sm:p-6">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600">Carregando atividades...</p>
                  </div>
                </div>
              ) : recentActivities.length === 0 ? (
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
                  <RecentActivities activities={recentActivities} loading={loading} formatCurrency={formatCurrency} />

              )}
            </div>
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
