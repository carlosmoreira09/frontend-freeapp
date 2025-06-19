import React, { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { Link } from 'react-router-dom';
import {api, type DailyTransaction, monthlyBudgetService} from "../../services";
import {toast} from "react-hot-toast";
import {useAuth} from "../../contexts/AuthContext.tsx";

interface DailyBudgetStatus {
  dailyBudget: number;
  remainingBalance: number;
  todaySpent: number;
  todayIncome: number;
  monthlyBudget: any;
  adjustedDailyBudget: number;
  previousDayBalance: number;
}

interface GroupedTransactions {
  [date: string]: {
    transactions: DailyTransaction[];
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
    dailyBudget: number;
    remainingBalance: number;
  };
}

const ClientTransactions: React.FC = () => {
  const { client } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions>({});
  const [dailyStatus, setDailyStatus] = useState<DailyBudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Initial data fetch
  useEffect(() => {
    if (client?.id) {
      fetchInitialData();
    }
  }, [client?.id]);

  // Fetch data when selected date changes
  useEffect(() => {
    if (selectedDate && client?.id) {
      fetchDailyStatusForDate(selectedDate).then();
    }
  }, [selectedDate, client?.id]);

  // Fetch initial data - all available dates
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch all transactions to get available dates
      const response = await api.get(`/daily-transactions/client/${client?.id}`);
      if(response.data) {
        const allTransactions: DailyTransaction[] = response.data.transactions || [];
        // Group transactions by date
        const grouped = groupTransactionsByDate(allTransactions);
        setGroupedTransactions(grouped);
        
        // Get available dates and sort them
        const dates = Object.keys(grouped).sort().reverse();
        setAvailableDates(dates);
        
        // Set default selected date to today if transactions exist, otherwise first available date
        const today = new Date().toISOString().split('T')[0];
        const defaultDate = dates.includes(today) ? today : (dates[0] || today);
        setSelectedDate(defaultDate);
      }

      // Initial daily status fetch will happen in the date change effect
      
    } catch (err) {
      setError(err as string);
      toast.error('Erro ao carregar transações: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions and daily status for a specific date
  const fetchDailyStatusForDate = async (date: string) => {
    try {
      // Fetch daily budget status for the selected date
      const dailyBudgetStatus = await monthlyBudgetService.getCurrentDailyStatus(date);
      if (selectedDate === availableDates[availableDates.length - 1]) {
        dailyBudgetStatus.previousDayBalance = 0
        dailyBudgetStatus.adjustedDailyBudget = 0
        dailyBudgetStatus.remainingBalance = 0;
      }
      setDailyStatus(dailyBudgetStatus);

      // If we don't have transactions for this date yet, fetch them
      if (!groupedTransactions[date]) {
        await fetchTransactionsForDate(date);
      }
    } catch (err) {
      toast.error('Erro ao carregar status diário: ' + err);
    }
  };

  // Fetch transactions for a specific date
  const fetchTransactionsForDate = async (date: string) => {
    try {
      const response = await api.get(`/daily-transactions/client/${client?.id}/date/${date}`);
      
      if (response.data) {
        const transactions: DailyTransaction[] = response.data || [];
        
        // Create a new grouped object for this date
        const newGrouped = { ...groupedTransactions };
        
        // Calculate totals for this date
        let totalIncome = 0;
        let totalExpense = 0;
        
        transactions.forEach(transaction => {
          if (transaction.type === 'income') {
            totalIncome += Number(transaction.amount);
          } else {
            totalExpense += Number(transaction.amount);
          }
        });
        
        // Add to grouped transactions using adjusted daily budget
        newGrouped[date] = {
          transactions,
          totalIncome,
          totalExpense,
          netAmount: totalIncome - totalExpense,
          dailyBudget: dailyStatus?.adjustedDailyBudget || dailyStatus?.dailyBudget || 0,
          remainingBalance: (dailyStatus?.adjustedDailyBudget || dailyStatus?.dailyBudget || 0) + totalIncome - totalExpense
        };
        
        setGroupedTransactions(newGrouped);
        
        // If this is a new date we discovered, add it to available dates
        if (!availableDates.includes(date)) {
          const newDates = [...availableDates, date].sort().reverse();
          setAvailableDates(newDates);
        }
      }
    } catch (err) {
      toast.error('Erro ao carregar transações para a data selecionada: ' + err);
    }
  };

  const groupTransactionsByDate = (transactions: DailyTransaction[]): GroupedTransactions => {
    const grouped: GroupedTransactions = {};
    
    transactions.forEach(transaction => {
      const dateKey = transaction.date ?  new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0] ;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          dailyBudget: 0,
          remainingBalance: 0
        };
      }
      
      grouped[dateKey].transactions.push(transaction);
      
      if (transaction.type === 'income') {
        grouped[dateKey].totalIncome += Number(transaction.amount);
      } else {
        grouped[dateKey].totalExpense += Number(transaction.amount);
      }
    });

    // Calculate net amounts (remaining balances will be calculated when daily status is fetched)
    Object.keys(grouped).forEach(dateKey => {
      const dayData = grouped[dateKey];
      dayData.netAmount = dayData.totalIncome - dayData.totalExpense;
      // Note: dailyBudget and remainingBalance will be set when we get the daily status for each date
    });

    return grouped;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Hoje';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | undefined) => {
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

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const sortedDates = availableDates;
  const selectedDateData = groupedTransactions[selectedDate];

  if (loading) {
    return (
      <ClientLayout>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0 px-2 sm:px-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Minhas Transações
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Acompanhe suas transações diárias e saldo restante
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 px-2 sm:px-0">
            <Link
              to="/client/transactions/new"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Nova Transação
            </Link>
          </div>
        </div>

        {/* Daily Budget Status */}
        {dailyStatus && (
          <div className="bg-white shadow rounded-lg p-4 mb-4 mx-2 sm:mx-0">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Status do Orçamento Diário</h3>
            
            {/* Previous Day Balance Info */}
            {dailyStatus.previousDayBalance !== 0 ? (
              <div className="mb-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Saldo do dia anterior:</span>
                  <span className={`font-medium ${
                    dailyStatus.previousDayBalance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dailyStatus.previousDayBalance > 0 ? '+' : ''}{formatCurrency(dailyStatus.previousDayBalance)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dailyStatus.previousDayBalance > 0 
                    ? 'Valor adicionado ao orçamento de hoje' 
                    : 'Valor deduzido do orçamento de hoje'}
                </div>
              </div>
            ) : (
              // Show first day indicator when there's no previous balance and adjusted budget equals base budget
              dailyStatus.adjustedDailyBudget === dailyStatus.dailyBudget && (
                <div className="mb-3 p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-700 font-medium">Primeiro dia de controle financeiro</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Começando com o orçamento base do mês
                  </div>
                </div>
              )
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Orçamento Base</p>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(dailyStatus.dailyBudget)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {dailyStatus.adjustedDailyBudget === dailyStatus.dailyBudget 
                    ? 'Orçamento de Hoje' 
                    : 'Orçamento Ajustado'}
                </p>
                <p className={`text-lg font-semibold ${
                  dailyStatus.adjustedDailyBudget >= dailyStatus.dailyBudget ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(dailyStatus.adjustedDailyBudget)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gasto Hoje</p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(dailyStatus.todaySpent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Saldo Restante</p>
                <p className={`text-lg font-semibold ${getBalanceColor(dailyStatus.remainingBalance)}`}>
                  {formatCurrency(dailyStatus.remainingBalance)}
                </p>
              </div>
            </div>
            
            {/* Budget Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso do Orçamento</span>
                <span>{Math.round((dailyStatus.todaySpent / (dailyStatus.adjustedDailyBudget || dailyStatus.dailyBudget)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dailyStatus.todaySpent > dailyStatus.adjustedDailyBudget ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  style={{ 
                    width: `${Math.min((dailyStatus.todaySpent / dailyStatus.adjustedDailyBudget) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-2 sm:mx-0">
            {error}
          </div>
        )}

        {/* Date Navigation Tabs */}
        {sortedDates.length > 0 && (
          <div className="mb-4 mx-2 sm:mx-0">
            <div className="bg-white shadow rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Selecionar Dia</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {sortedDates.map(dateKey => {
                  const dayData = groupedTransactions[dateKey];
                  const isSelected = dateKey === selectedDate;
                  const isToday = dateKey === new Date().toISOString().split('T')[0];
                  
                  return (
                    <button
                      key={dateKey}
                      onClick={() => handleDateChange(dateKey)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-w-[80px] ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${isToday ? 'ring-2 ring-orange-300' : ''}`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{formatDateShort(dateKey)}</div>
                        <div className={`text-xs ${isSelected ? 'text-orange-100' : 'text-gray-500'}`}>
                          {dayData?.transactions.length || 0} transação{(dayData?.transactions.length || 0) !== 1 ? 'ões' : ''}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selected Date Transactions */}
        {sortedDates.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-2 sm:mx-0">
            <div className="text-center py-12 px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma transação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira transação.</p>
              <div className="mt-6">
                <Link
                  to="/client/transactions/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Nova Transação
                </Link>
              </div>
            </div>
          </div>
        ) : selectedDateData ? (
          <div className="bg-white shadow rounded-lg overflow-hidden mx-2 sm:mx-0">
            {/* Selected Day Header */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900 capitalize sm:text-lg">
                    {formatDate(selectedDate)}
                  </h3>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {new Date(selectedDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs sm:text-sm">
                    <span className="text-green-600">
                      +{formatCurrency(selectedDateData.totalIncome)}
                    </span>
                    <span className="text-red-600">
                      -{formatCurrency(selectedDateData.totalExpense)}
                    </span>
                  </div>
                  <div className={`text-sm font-semibold sm:text-lg ${getBalanceColor(selectedDateData.remainingBalance)}`}>
                    {formatCurrency(selectedDateData.remainingBalance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List for Selected Date */}
            <div className="divide-y divide-gray-200">
              {selectedDateData.transactions.map((transaction) => (
                <div key={transaction.id} className="px-4 py-3 sm:px-6 sm:py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3 sm:space-x-3">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500 sm:text-sm">
                            {transaction.category?.name || 'Sem categoria'}
                          </p>
                          {/* Mobile: Show status below description */}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 sm:hidden ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-3">
                      {/* Desktop: Show status badge */}
                      <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                      <div className="text-right">
                        <p className={`text-sm font-medium sm:text-base ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                        </p>
                        <p className="text-xs text-gray-500">
                          Saldo: {formatCurrency(Number(transaction.remainingBalanceAfterTransaction))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-2 sm:mx-0">
            <div className="text-center py-12 px-4">
              <h3 className="text-sm font-medium text-gray-900">Nenhuma transação nesta data</h3>
              <p className="mt-1 text-sm text-gray-500">Selecione outra data ou crie uma nova transação.</p>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientTransactions;
