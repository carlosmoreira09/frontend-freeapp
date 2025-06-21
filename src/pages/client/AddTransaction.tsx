import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import CategorySelect from '../../components/CategorySelect';
import { toast } from 'react-hot-toast';
import {type DailyTransaction, dailyTransactionService, TransactionType} from "../../services";

const AddTransaction: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('debit');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !categoryId) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    try {
      setLoading(true);
      const transactionType = type === 'credit' ? TransactionType.INCOME : TransactionType.EXPENSE;
      const formattedDate = date
        ? new Date(date).toISOString() 
        : new Date().toISOString();
      const transaction: DailyTransaction = {
        amount: parseFloat(amount),
        type: transactionType,
        description,
        categoryId: categoryId,
        date: formattedDate,
      }
      const result = await dailyTransactionService.createDailyTransaction(transaction);
      if(result?.message.toString().includes('successfully')) {
        toast.success('Transação adicionada com sucesso!');
        navigate('/client/transactions');
      }
    } catch (error) {
      toast.error('Erro ao adicionar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/client/transactions');
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Adicionar Nova Transação</h2>
            <p className="mt-1 text-sm text-gray-500">
              Preencha os detalhes abaixo para adicionar uma nova transação
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ex: Assinatura Mensal"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0,00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data (opcional)
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  max={today}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Se não informada, será usada a data atual
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="debit"
                      name="transaction-type"
                      type="radio"
                      checked={type === 'debit'}
                      onChange={() => setType('debit')}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <label htmlFor="debit" className="ml-2 block text-sm text-gray-700">
                      Despesa
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="credit"
                      name="transaction-type"
                      type="radio"
                      checked={type === 'credit'}
                      onChange={() => setType('credit')}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <label htmlFor="credit" className="ml-2 block text-sm text-gray-700">
                      Receita
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <CategorySelect
                  value={categoryId}
                  onChange={setCategoryId}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                >
                  {loading ? 'Adicionando...' : 'Adicionar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default AddTransaction;
