import React, { useState, useEffect, useMemo } from 'react';
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import Layout from '../../components/layout/Layout';
import TransactionFilters from '../../components/transactions/TransactionFilters';
import TransactionTable from '../../components/transactions/TransactionTable';
import TransactionSummaryCards from '../../components/transactions/TransactionSummaryCards';
import TransactionCharts from '../../components/transactions/TransactionCharts';
import { dailyTransactionService, adminService } from '../../services';
import type { DailyTransaction, TransactionSummary, AdminClientData } from '../../types';
import { TransactionType } from '../../types';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Define the filters state interface to match TransactionFilters component
interface TransactionFiltersState {
  clientId: string;
  startDate: string;
  endDate: string;
  type: TransactionType | '';
}

// Client information card component
const ClientInfoCard: React.FC<{ client: AdminClientData | null; loading: boolean }> = ({ client, loading }) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 border-l-4 border-orange-600">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <UserCircleIcon className="h-6 w-6 text-orange-600 mr-2" />
        Informações do Cliente
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center">
          <UserCircleIcon className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-sm font-medium text-gray-500 mr-1">Nome:</span>
          <span className="text-sm text-gray-800">{client.name}</span>
        </div>
        <div className="flex items-center">
          <EnvelopeIcon className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-sm font-medium text-gray-500 mr-1">Email:</span>
          <span className="text-sm text-gray-800">{client.email}</span>
        </div>
        <div className="flex items-center">
          <CreditCardIcon className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-sm font-medium text-gray-500 mr-1">CPF:</span>
          <span className="text-sm text-gray-800">{client.cpf}</span>
        </div>
        {client.phone && (
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-500 mr-1">Telefone:</span>
            <span className="text-sm text-gray-800">{client.phone}</span>
          </div>
        )}
        {(client.city || client.state) && (
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-500 mr-1">Localização:</span>
            <span className="text-sm text-gray-800">
              {[client.city, client.state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-sm font-medium text-gray-500 mr-1">Status:</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            client.status === 'active' ? 'bg-green-100 text-green-800' : 
            client.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
            client.status === 'suspended' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {client.status === 'active' ? 'Ativo' : 
             client.status === 'inactive' ? 'Inativo' : 
             client.status === 'suspended' ? 'Suspenso' : 'Pendente'}
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminDailyTransactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<DailyTransaction[]>([]);
  const [clients, setClients] = useState<AdminClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<AdminClientData | null>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [summary, setSummary] = useState<TransactionSummary>({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<TransactionFiltersState>({
    clientId: '',
    startDate: '',
    endDate: '',
    type: '',
  });

  // Fetch clients for filter dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getClients(1, 100);
        setClients(response.clients);
        setClientsLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClientsLoading(false);
      }
    };

    fetchClients().then();
  }, []);

  // Fetch all transactions once
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await dailyTransactionService.getAllDailyTransactions();
        setAllTransactions(response.transactions);
        setTotalPages(response.pagination);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions().then();
  }, []);

  // Filter transactions and calculate summary based on filters
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      // Apply client filter
      if (filters.clientId && transaction.clientId !== filters.clientId) {
        return false;
      }
      
      // Apply date range filter
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        const transactionDate = new Date(transaction.date);
        if (transactionDate < startDate) {
          return false;
        }
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        const transactionDate = new Date(transaction.date);
        if (transactionDate > endDate) {
          return false;
        }
      }
      
      // Apply transaction type filter
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }
      
      return true;
    });
  }, [allTransactions, filters]);

  // Calculate summary from filtered transactions
  useEffect(() => {
    setSummaryLoading(true);
    const calculateSummary = () => {
      const summaryData = filteredTransactions.reduce(
        (acc, transaction) => {
          // Convert amount to number to ensure proper addition
          const amount = Number(transaction.amount);
          if (transaction.type == TransactionType.INCOME) {
            acc.income += amount;
          } else if (transaction.type == TransactionType.EXPENSE) {
            acc.expense += amount;
          }
          return acc;
        },
        { income: 0, expense: 0, balance: 0 }
      );
      
      // Calculate balance
      setSummary(summaryData);
      setSummaryLoading(false);
    };
    
    calculateSummary();
  }, [filteredTransactions]);

  // Fetch client details when clientId changes
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!filters.clientId) {
        setSelectedClient(null);
        return;
      }
      
      setClientLoading(true);
      try {
        const clientData = await adminService.getClient(filters.clientId);
        setSelectedClient(clientData);
        setClientLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setClientLoading(false);
      }
    };

    fetchClientDetails().then();
  }, [filters.clientId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: TransactionFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-600">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Transações Diárias</h1>
            <p className="mt-1 text-sm text-orange-600">
              Visualize e analise todas as transações dos clientes
            </p>
          </div>
        </header>

        {/* Transaction Summary Cards */}
        <TransactionSummaryCards summary={summary} loading={summaryLoading} />

        {/* Filters */}
        <div className="mb-6">
          <TransactionFilters 
            clients={clients} 
            loading={clientsLoading} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Client Information Card */}
        {(filters.clientId || clientLoading) && (
          <ClientInfoCard client={selectedClient} loading={clientLoading} />
        )}

        {/* Tabs */}
        <div className="mb-6">
          <TabGroup>
            <TabList className="flex space-x-1 rounded-xl bg-orange-50 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow text-orange-700'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-orange-700'
                  )
                }
              >
                Tabela de Transações
              </Tab>
              {/*<Tab*/}
              {/*  className={({ selected }) =>*/}
              {/*    classNames(*/}
              {/*      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',*/}
              {/*      'ring-white ring-opacity-60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2',*/}
              {/*      selected*/}
              {/*        ? 'bg-white shadow text-orange-700'*/}
              {/*        : 'text-gray-600 hover:bg-white/[0.12] hover:text-orange-700'*/}
              {/*    )*/}
              {/*  }*/}
              {/*>*/}
              {/*  Gráficos*/}
              {/*</Tab>*/}
            </TabList>
            <TabPanels className="mt-2">
              <TabPanel className="rounded-xl bg-white p-3">
                <TransactionTable 
                  transactions={filteredTransactions} 
                  loading={loading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </TabPanel>
              <TabPanel className="rounded-xl bg-white p-3">
                <TransactionCharts 
                  transactions={filteredTransactions}
                  loading={loading}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDailyTransactions;
