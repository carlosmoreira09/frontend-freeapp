import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement,
  type ChartOptions } from 'chart.js';
import {Doughnut, Line, Chart} from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

interface FinancialAnalyticsProps {
  categorySpending: CategorySpending[];
  dailySpendingTrend: DailySpendingData[];
  monthlyBalance: MonthlyBalanceData[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({
  categorySpending,
  dailySpendingTrend,
  monthlyBalance,
  loading,
  formatCurrency
}) => {
  // Prepare category spending chart data
  const categoryChartData = {
    labels: categorySpending.map(cat => cat.categoryName),
    datasets: [
      {
        data: categorySpending.map(cat => cat.amount),
        backgroundColor: categorySpending.map(cat => cat.color),
        borderWidth: 1,
      },
    ],
  };

  // Prepare daily spending trend chart data
  const dailyTrendData = {
    labels: dailySpendingTrend.map(day => {
      try {
        const date = new Date(day.date);
        if (isNaN(date.getTime())) {
          return day.date; // Fallback to original string if date is invalid
        }
        return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
      } catch (error) {
        console.error('Error formatting date:', day.date, error);
        return day.date; // Fallback to original string
      }
    }),
    datasets: [
      {
        label: 'Receitas',
        data: dailySpendingTrend.map(day => day.income),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Despesas',
        data: dailySpendingTrend.map(day => day.expense),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Prepare monthly balance chart data
  const monthlyBalanceData = {
    labels: monthlyBalance.map(month => {
      try {
        // Format month string for display
        const [year, monthNum] = month.month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        if (isNaN(date.getTime())) {
          return month.month; // Fallback to original string if date is invalid
        }
        return date.toLocaleDateString('pt-BR', { month: 'short' });
      } catch (error) {
        console.error('Error formatting month:', month.month, error);
        return month.month; // Fallback to original string
      }
    }),
    datasets: [
      {
        type: 'line' as const,
        label: 'Receitas',
        data: monthlyBalance.map(month => month.income),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Despesas',
        data: monthlyBalance.map(month => month.expense),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        order: 3,
      },
      {
        type: 'line' as const,
        label: 'Saldo',
        data: monthlyBalance.map(month => month.balance),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        order: 1, // Ensure line is drawn on top
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw !== null ? formatCurrency(context.raw) : 'N/A';
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw !== null ? formatCurrency(context.raw) : 'N/A';
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw !== null ? formatCurrency(context.raw) : 'N/A';
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: false,
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Carregando análises financeiras...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-2 sm:mx-0">
      {/* Category Spending */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gastos por Categoria</h3>
        {categorySpending.length > 0 ? (
          <div className="h-64">
            <Doughnut data={categoryChartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Nenhum dado de categoria disponível</p>
        )}
        {categorySpending.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detalhamento:</h4>
            <ul className="space-y-1">
              {categorySpending.slice(0, 5).map((category) => (
                <li key={category.categoryId} className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span>{category.categoryName}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(category.amount)}</span>
                </li>
              ))}
              {categorySpending.length > 5 && (
                <li className="text-sm text-gray-500 text-center pt-1">
                  + {categorySpending.length - 5} outras categorias
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Daily Spending Trend */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tendência de Gastos (Últimos 7 dias)</h3>
        {dailySpendingTrend.length > 0 ? (
          <div className="h-64">
            <Line 
              data={dailyTrendData} 
              options={lineChartOptions} 
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Nenhum dado de tendência disponível</p>
        )}
      </div>

      {/* Monthly Balance */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Balanço Mensal</h3>
        {monthlyBalance.length > 0 ? (
          <div className="h-64">
            <Chart
                data={monthlyBalanceData}
                options={barChartOptions}
                type={'bar'}            />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Nenhum dado de balanço mensal disponível</p>
        )}
      </div>
    </div>
  );
};

export default FinancialAnalytics;
