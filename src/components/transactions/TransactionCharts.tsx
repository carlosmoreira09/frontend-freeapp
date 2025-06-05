import React, { useMemo } from 'react';
import { type DailyTransaction, TransactionType } from '../../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface TransactionChartsProps {
  transactions: DailyTransaction[];
  loading: boolean;
}

const TransactionCharts: React.FC<TransactionChartsProps> = ({ transactions, loading }) => {
  const chartData = useMemo(() => {
    const groupedByDate = transactions.reduce((acc, transaction) => {
      const date = transaction.date ? new Date(transaction.date).toLocaleDateString('pt-BR') : ''
      if (!acc[date]) {
        acc[date] = {
          income: 0,
          expense: 0
        };
      }
      
      if (transaction.type === TransactionType.INCOME) {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      return new Date(a.split('/').reverse().join('-')).getTime() - 
             new Date(b.split('/').reverse().join('-')).getTime();
    });

    const groupedByClient = transactions.reduce((acc, transaction) => {
      const clientName = transaction.clientName || 'Desconhecido';
      if (!acc[clientName]) {
        acc[clientName] = {
          income: 0,
          expense: 0
        };
      }
      
      if (transaction.type === TransactionType.INCOME) {
        acc[clientName].income += transaction.amount;
      } else {
        acc[clientName].expense += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const totalByType = transactions.reduce((acc, transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    }, { income: 0, expense: 0 });

    return {
      byDate: {
        labels: sortedDates,
        incomeData: sortedDates.map(date => groupedByDate[date].income),
        expenseData: sortedDates.map(date => groupedByDate[date].expense)
      },
      byClient: {
        labels: Object.keys(groupedByClient),
        incomeData: Object.values(groupedByClient).map(data => data.income),
        expenseData: Object.values(groupedByClient).map(data => data.expense)
      },
      byType: {
        labels: ['Receitas', 'Despesas'],
        data: [totalByType.income, totalByType.expense]
      }
    };
  }, [transactions]);

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transações por Data',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartData = {
    labels: chartData.byDate.labels,
    datasets: [
      {
        label: 'Receitas',
        data: chartData.byDate.incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: chartData.byDate.expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: chartData.byType.labels,
    datasets: [
      {
        data: chartData.byType.data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const clientBarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transações por Cliente',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const clientBarChartData = {
    labels: chartData.byClient.labels,
    datasets: [
      {
        label: 'Receitas',
        data: chartData.byClient.incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: chartData.byClient.expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução de Transações',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: chartData.byDate.labels,
    datasets: [
      {
        label: 'Receitas',
        data: chartData.byDate.incomeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Despesas',
        data: chartData.byDate.expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando gráficos...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Nenhuma transação encontrada para gerar gráficos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Distribution by Type */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Tipo</h3>
        <div className="h-64">
          <Pie data={pieChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions by Date */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transações por Data</h3>
          <div className="h-64">
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </div>

        {/* Transactions by Client */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transações por Cliente</h3>
          <div className="h-64">
            <Bar options={clientBarChartOptions} data={clientBarChartData} />
          </div>
        </div>
      </div>

      {/* Transaction Evolution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Evolução de Transações</h3>
        <div className="h-64">
          <Line options={lineChartOptions} data={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default TransactionCharts;
