import React from 'react';
import {type AdminClientData, TransactionType } from '../../types';

interface TransactionFiltersProps {
  clients: AdminClientData[];
  loading?: boolean;
  filters: {
    clientId: string;
    startDate: string;
    endDate: string;
    type: TransactionType | '';
  };
  onFilterChange: (filters: TransactionFiltersProps['filters']) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ 
  clients, 
  loading = false, 
  filters, 
  onFilterChange 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      clientId: '',
      startDate: '',
      endDate: '',
      type: ''
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Client Filter */}
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          {loading ? (
            <div className="mt-1 block w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <select
              id="clientId"
              name="clientId"
              value={filters.clientId}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Todos os Clientes</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Start Date Filter */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Data Inicial
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Data Final
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          />
        </div>

        {/* Transaction Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Transação
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            <option value="">Todos os Tipos</option>
            <option value={TransactionType.INCOME}>Receita</option>
            <option value={TransactionType.EXPENSE}>Despesa</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
