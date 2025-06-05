import React from 'react';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();

  const navigateToCategories = () => {
    navigate('/admin/categories');
  };

  const navigateToProfile = () => {
    navigate('/admin/profile');
  };

  const navigateToChangePassword = () => {
    navigate('/admin/change-password');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-600">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          </div>
        </header>

        {/* Admin Tools Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-orange-500 mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Ferramentas de Administração</h3>
            <p className="mt-1 text-sm text-orange-600 mb-4">Acesse ferramentas administrativas adicionais.</p>
            
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={navigateToCategories}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Gerenciar Categorias
              </button>
            </div>
          </div>
        </div>

        {/* Admin Profile Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-orange-500 mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Meu Perfil</h3>
            <p className="mt-1 text-sm text-orange-600 mb-4">Gerencie suas informações pessoais e segurança.</p>
            
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={navigateToProfile}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Editar Perfil
              </button>
              <button
                type="button"
                onClick={navigateToChangePassword}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;
