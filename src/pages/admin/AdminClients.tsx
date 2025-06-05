import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';
import {type AdminClientData, adminService} from '../../services';


const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<AdminClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients().then();
  }, [page, limit]);

  const fetchClients = async () => {
    try {
      setPage(1)
      setLimit(100)
      setLoading(true);
      setError(null);
      
      const response = await adminService.getClients(page, limit, searchTerm);
      if(response && response.clients) {
        setClients(response.clients);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Falha ao carregar clientes. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    navigate('/admin/clients/new');
  };

  const handleEditClient = (id: string) => {
    navigate(`/admin/clients/edit/${id}`);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      setIsDeleting(id);
      
      await adminService.deleteClient(id);
      toast.success('Cliente excluído com sucesso!');
      fetchClients().then()
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      toast.error('Falha ao excluir cliente. Por favor, tente novamente.');
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusLabel = (status: boolean | undefined): string => {
    if(status === undefined) return 'Inativo'
    switch (status) {
      case true:
        return 'Ativo';
      case false:
        return 'Inativo';
      default:
        return status;
    }
  };

  const filteredClients = clients.filter(client => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-600">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
          </div>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-orange-500">
          <div className="px-4 py-5 sm:p-6">
            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
              <div className="w-full md:w-1/3">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Buscar por nome ou email"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                  onClick={handleAddClient}
                >
                  Adicionar Novo Cliente
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando clientes...</p>
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                      >
                        Data de Cadastro
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider"
                      >
                        Status
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
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          Nenhum cliente encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-orange-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-medium">
                                  {client.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">ID: {client.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                            >
                              {getStatusLabel(client.isActive)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              className="text-orange-600 hover:text-orange-900 mr-4"
                              onClick={() => handleEditClient(client.id)}
                            >
                              Editar
                            </button>
                            <button 
                              className="hidden text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteClient(client.id)}
                              disabled={isDeleting === client.id}
                            >
                              {isDeleting === client.id ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Excluindo...
                                </span>
                              ) : 'Excluir'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminClients;
