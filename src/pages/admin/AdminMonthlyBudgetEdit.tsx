import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';
import { monthlyBudgetService, type MonthlyBudget, type MonthlyBudgetFormData } from '../../services';

const AdminMonthlyBudgetEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [budget, setBudget] = useState<MonthlyBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MonthlyBudgetFormData>({
    monthlySalary: 0,
    budgetAmount: 0,
    isPercentage: false,
  });

  useEffect(() => {
    if (id) {
      fetchBudget();
    }
  }, [id]);

  const fetchBudget = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await monthlyBudgetService.getById(id);
      setBudget(response);
      setFormData({
        monthlySalary: response.monthlySalary,
        budgetAmount: response.budgetAmount,
        isPercentage: response.isPercentage,
      });

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar orçamento mensal:', err);
      setError('Falha ao carregar orçamento mensal. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !budget) return;

    try {
      setSaving(true);

      // Update monthly salary if changed
      if (formData.monthlySalary !== budget.monthlySalary) {
        await monthlyBudgetService.updateMonthlySalary(id, formData.monthlySalary);
      }

      // Update budget amount if changed
      if (formData.budgetAmount !== budget.budgetAmount || formData.isPercentage !== budget.isPercentage) {
        await monthlyBudgetService.updateBudgetAmount(id, formData.budgetAmount, formData.isPercentage);
      }

      toast.success('Orçamento mensal atualizado com sucesso!');
      navigate('/admin/monthly-budgets');
    } catch (err) {
      console.error('Erro ao atualizar orçamento mensal:', err);
      toast.error('Falha ao atualizar orçamento mensal. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
          ? parseFloat(value) || 0
          : value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando orçamento mensal...</p>
        </div>
      </Layout>
    );
  }

  if (error || !budget) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error || 'Orçamento mensal não encontrado'}
                </h3>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/monthly-budgets')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          >
            Voltar para Orçamentos
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Orçamento Mensal</h1>
            <p className="mt-1 text-sm text-gray-600">
              {getMonthName(budget.month)} {budget.year}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/monthly-budgets')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          >
            Voltar
          </button>
        </div>

        {/* Current Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-orange-800 mb-2">Informações Atuais</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-orange-700">Orçamento Diário:</span>
              <span className="ml-2 font-medium">{formatCurrency(budget.dailyBudget)}</span>
            </div>
            <div>
              <span className="text-orange-700">Saldo Restante:</span>
              <span className={`ml-2 font-medium ${
                budget.remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(budget.remainingBalance)}
              </span>
            </div>
            <div>
              <span className="text-orange-700">Dias no Mês:</span>
              <span className="ml-2 font-medium">{budget.daysInMonth}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="monthlySalary" className="block text-sm font-medium text-gray-700 mb-2">
                Salário Mensal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                <input
                  type="number"
                  id="monthlySalary"
                  name="monthlySalary"
                  value={formData.monthlySalary}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Orçamento
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {formData.isPercentage ? '%' : 'R$'}
                </span>
                <input
                  type="number"
                  id="budgetAmount"
                  name="budgetAmount"
                  value={formData.budgetAmount}
                  onChange={handleInputChange}
                  step={formData.isPercentage ? "0.1" : "0.01"}
                  min="0"
                  max={formData.isPercentage ? "100" : undefined}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={formData.isPercentage ? "0,0" : "0,00"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPercentage"
                  checked={formData.isPercentage}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Usar percentual do salário mensal
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                {formData.isPercentage 
                  ? 'O orçamento será calculado como uma porcentagem do salário mensal'
                  : 'O orçamento será um valor fixo em reais'
                }
              </p>
            </div>

            {/* Preview */}
            {formData.monthlySalary > 0 && formData.budgetAmount > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Prévia do Cálculo</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    Salário Mensal: <span className="font-medium">{formatCurrency(formData.monthlySalary)}</span>
                  </div>
                  <div>
                    Orçamento Total: <span className="font-medium">
                      {formatCurrency(
                        formData.isPercentage 
                          ? (formData.monthlySalary * formData.budgetAmount) / 100
                          : formData.budgetAmount
                      )}
                    </span>
                  </div>
                  <div>
                    Orçamento Diário Estimado: <span className="font-medium">
                      {formatCurrency(
                        (formData.isPercentage 
                          ? (formData.monthlySalary * formData.budgetAmount) / 100
                          : formData.budgetAmount
                        ) / budget.daysInMonth
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/monthly-budgets')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminMonthlyBudgetEdit;
