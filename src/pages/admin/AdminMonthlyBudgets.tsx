import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';
import { monthlyBudgetService, adminService, type MonthlyBudgetWithClient, type AdminClientData } from '../../services';

const AdminMonthlyBudgets: React.FC = () => {
  const [budgets, setBudgets] = useState<MonthlyBudgetWithClient[]>([]);
  const [clients, setClients] = useState<AdminClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchBudgetsByClient();
    }
  }, [selectedClientId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch clients for the dropdown
      const clientsResponse = await adminService.getClients(1, 100);
      if (clientsResponse && clientsResponse.clients) {
        setClients(clientsResponse.clients);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar dados iniciais:', err);
      setError('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const fetchBudgetsByClient = async () => {
    if (!selectedClientId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await monthlyBudgetService.getByClientId(selectedClientId);
      setBudgets(response.map(budget => ({
        ...budget,
        client: clients.find(c => c.id === selectedClientId) || { id: selectedClientId, name: 'Cliente não encontrado', email: '' }
      })));

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar orçamentos mensais:', err);
      setError('Falha ao carregar orçamentos mensais. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!selectedClientId) {
      toast.error('Selecione um cliente primeiro');
      return;
    }

    try {
      setIsCreating(true);
      await monthlyBudgetService.getOrCreateByYearMonth(selectedClientId, selectedYear, selectedMonth);
      toast.success('Orçamento mensal criado/encontrado com sucesso!');
      await fetchBudgetsByClient();
    } catch (err) {
      console.error('Erro ao criar orçamento mensal:', err);
      toast.error('Falha ao criar orçamento mensal. Por favor, tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditBudget = (budgetId: string) => {
    navigate(`/admin/monthly-budgets/edit/${budgetId}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  const filteredBudgets = budgets.filter(budget =>
    budget.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${getMonthName(budget.month)} ${budget.year}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: getMonthName(i + 1) }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orçamentos Mensais</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie os orçamentos mensais dos clientes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                id="client-select"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleCreateBudget}
                disabled={!selectedClientId || isCreating}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isCreating ? 'Criando...' : 'Criar/Buscar Orçamento'}
              </button>
            </div>
          </div>

          {selectedClientId && (
            <div className="border-t pt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Buscar por cliente ou período"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {!selectedClientId ? (
          <div className="text-center py-10">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Selecione um cliente</h3>
            <p className="mt-1 text-sm text-gray-500">
              Escolha um cliente para visualizar seus orçamentos mensais.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando orçamentos mensais...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
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
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Período
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Salário Mensal
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Orçamento
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Orçamento Diário
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Saldo Restante
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Criado em
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-orange-800 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBudgets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum orçamento mensal encontrado para este cliente.
                      </td>
                    </tr>
                  ) : (
                    filteredBudgets.map((budget) => (
                      <tr key={budget.id} className="hover:bg-orange-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getMonthName(budget.month)} {budget.year}
                          </div>
                          <div className="text-sm text-gray-500">
                            {budget.daysInMonth} dias
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(budget.monthlySalary)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(budget.budgetAmount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {budget.isPercentage ? 'Percentual' : 'Valor fixo'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(budget.dailyBudget)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            budget.remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(budget.remainingBalance)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(budget.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditBudget(budget.id)}
                            className="text-orange-600 hover:text-orange-900 mr-3 transition-colors duration-200"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminMonthlyBudgets;
