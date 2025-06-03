import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';
import { MaritalStatus, type AdminClientData } from '../../types';
import {adminService} from "../../services";

const ClientFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [client, setClient] = useState<AdminClientData | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthday: '',
    age: '',
    salary: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    complement: '',
    maritalStatus: MaritalStatus.SINGLE,
    password: '',
    confirmPassword: '',
    isActive: true,
    managerId: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load client data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchClient();
    }
  }, [id]);

  // Fetch client data
  const fetchClient = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // In a real app, you would fetch from the API
      // const client = await adminService.getClient(id);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock client data
      const mockClient: AdminClientData = {
        id,
        name: 'Cliente de Teste',
        email: 'cliente@teste.com',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        birthday: '1990-01-01',
        age: 33,
        salary: 5000,
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        complement: 'Apto 123',
        maritalStatus: MaritalStatus.SINGLE,
        isActive: true,
        managerId: '',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setClient(mockClient);
      
      // Update form data
      setFormData({
        ...formData,
        name: mockClient.name,
        email: mockClient.email,
        cpf: mockClient.cpf || '',
        phone: mockClient.phone || '',
        birthday: mockClient.birthday || '',
        age: mockClient.age?.toString() || '',
        salary: mockClient.salary?.toString() || '',
        address: mockClient.address || '',
        city: mockClient.city || '',
        state: mockClient.state || '',
        zipCode: mockClient.zipCode || '',
        complement: mockClient.complement || '',
        maritalStatus: mockClient.maritalStatus || MaritalStatus.SINGLE,
        isActive: mockClient.isActive ?? true,
        managerId: mockClient.managerId || '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Não foi possível carregar os dados do cliente.');
      navigate('/admin/clients');
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00';
    }
    
    if (formData.phone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (00) 00000-0000';
    }
    
    if (!isEditMode && !formData.password) {
      newErrors.password = 'Senha é obrigatória para novos clientes';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare data for submission
      const clientData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined
      };
      
      // In a real app, you would call the API
      if (isEditMode) {
         await adminService.updateClient(id, clientData);
      } else {
        await adminService.createClient(clientData);
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success(isEditMode ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
      
      // Redirect back to clients list
      navigate('/admin/clients');
    } catch (error) {
      console.error('Error submitting client form:', error);
      toast.error(isEditMode ? 'Erro ao atualizar cliente.' : 'Erro ao criar cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Format CPF input
    if (name === 'cpf') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 11) {
        let formattedCpf = '';
        
        if (digits.length > 0) formattedCpf = digits.substring(0, 3);
        if (digits.length > 3) formattedCpf += '.' + digits.substring(3, 6);
        if (digits.length > 6) formattedCpf += '.' + digits.substring(6, 9);
        if (digits.length > 9) formattedCpf += '-' + digits.substring(9, 11);
        
        setFormData(prev => ({ ...prev, [name]: formattedCpf }));
      }
      return;
    }
    
    // Format phone input
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 11) {
        let formattedPhone = '';
        
        if (digits.length > 0) formattedPhone = '(' + digits.substring(0, 2);
        if (digits.length > 2) formattedPhone += ') ' + digits.substring(2, 7);
        if (digits.length > 7) formattedPhone += '-' + digits.substring(7, 11);
        
        setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      }
      return;
    }
    
    // Handle all other inputs
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/clients');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados do cliente...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode 
                ? 'Atualize as informações do cliente abaixo' 
                : 'Preencha as informações para adicionar um novo cliente'}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.email ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* CPF */}
                <div className="sm:col-span-3">
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                    CPF *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="cpf"
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.cpf ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.cpf && (
                      <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.phone ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Birthday */}
                <div className="sm:col-span-3">
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                    Data de Nascimento
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="birthday"
                      id="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="sm:col-span-3">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Idade
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="age"
                      id="age"
                      min="0"
                      value={formData.age}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Salary */}
                <div className="sm:col-span-3">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                    Salário
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="salary"
                      id="salary"
                      min="0"
                      step="0.01"
                      value={formData.salary}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div className="sm:col-span-3">
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                    Estado Civil
                  </label>
                  <div className="mt-1">
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value={MaritalStatus.SINGLE}>Solteiro(a)</option>
                      <option value={MaritalStatus.MARRIED}>Casado(a)</option>
                      <option value={MaritalStatus.DIVORCED}>Divorciado(a)</option>
                      <option value={MaritalStatus.WIDOWED}>Viúvo(a)</option>
                      <option value={MaritalStatus.OTHER}>Outro</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* State */}
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Zip Code */}
                <div className="sm:col-span-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Complement */}
                <div className="sm:col-span-6">
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
                    Complemento
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="complement"
                      id="complement"
                      value={formData.complement}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Password - only show for new clients or when editing */}
                <div className="sm:col-span-3">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {isEditMode ? 'Nova Senha' : 'Senha *'}
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.password ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    {isEditMode && (
                      <p className="mt-1 text-xs text-gray-500">Deixe em branco para manter a senha atual</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="sm:col-span-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.confirmPassword ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Active Status - only show when editing */}
                {isEditMode && (
                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Cliente Ativo
                      </label>
                    </div>
                  </div>
                )}
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
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    isEditMode ? 'Atualizar Cliente' : 'Criar Cliente'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientFormPage;
