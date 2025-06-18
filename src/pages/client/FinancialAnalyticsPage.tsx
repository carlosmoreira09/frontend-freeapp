import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ClientLayout from '../../components/layout/ClientLayout';
import { FinancialAnalytics } from '../../components/dashboard';
import { api } from '../../services';
import { toast } from 'react-hot-toast';

interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  color: string;
}

interface DailySpendingData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

interface MonthlyBalanceData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

const FinancialAnalyticsPage: React.FC = () => {
  const { client } = useAuth();
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [dailySpendingTrend, setDailySpendingTrend] = useState<DailySpendingData[]>([]);
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!client?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch category spending data
        const categoryResponse = await api.get(`/analytics/category-spending/${client.id}`);
        if (categoryResponse.data) {
          // Map colors to categories
          const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F94144'
          ];
          
          const categoriesWithColors = categoryResponse.data.map((cat: any, index: number) => ({
            ...cat,
            color: colors[index % colors.length]
          }));
          
          setCategorySpending(categoriesWithColors);
        }
        
        // Fetch daily spending trend
        const dailyResponse = await api.get(`/analytics/daily-trend/${client.id}`);
        if (dailyResponse.data) {
          setDailySpendingTrend(dailyResponse.data);
        }
        
        // Fetch monthly balance data
        const monthlyResponse = await api.get(`/analytics/monthly-balance/${client.id}`);
        if (monthlyResponse.data) {
          setMonthlyBalance(monthlyResponse.data);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Erro ao carregar dados analíticos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [client?.id]);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Análise Financeira
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualize seus gastos e tendências financeiras
          </p>
        </div>
        
        <FinancialAnalytics
          categorySpending={categorySpending}
          dailySpendingTrend={dailySpendingTrend}
          monthlyBalance={monthlyBalance}
          loading={loading}
          formatCurrency={formatCurrency}
        />
      </div>
    </ClientLayout>
  );
};

export default FinancialAnalyticsPage;
