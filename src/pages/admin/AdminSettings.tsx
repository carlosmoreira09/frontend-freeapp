import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  notificationsEnabled: boolean;
  defaultCurrency: string;
  dateFormat: string;
}

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initial settings (would normally be fetched from API)
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'AppFree',
    contactEmail: 'admin@appfree.com',
    allowRegistration: false,
    maintenanceMode: false,
    notificationsEnabled: true,
    defaultCurrency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
  });

  useEffect(() => {
    // Check if there are saved settings in localStorage
    const savedAllowRegistration = localStorage.getItem('allowRegistration');
    if (savedAllowRegistration !== null) {
      setSettings(prev => ({
        ...prev,
        allowRegistration: savedAllowRegistration === 'true'
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({
        ...settings,
        [name]: checked,
      });

      // Save allowRegistration setting to localStorage
      if (name === 'allowRegistration') {
        localStorage.setItem('allowRegistration', checked.toString());
      }
    } else {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao salvar as configurações');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow mb-6 rounded-lg border-l-4 border-orange-600">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          </div>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-orange-500">
          <div className="px-4 py-5 sm:p-6">
            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Configurações salvas com sucesso!</h3>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-8 divide-y divide-gray-200">
                {/* General Settings */}
                <div className="pt-8">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Configurações Gerais</h3>
                    <p className="mt-1 text-sm text-orange-600">Configuração básica da aplicação.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Nome do Site
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="siteName"
                          id="siteName"
                          value={settings.siteName}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Email de Contato
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="contactEmail"
                          id="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div className="pt-8">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Configurações do Sistema</h3>
                    <p className="mt-1 text-sm text-orange-600">Configure como a aplicação se comporta.</p>
                  </div>
                  <div className="mt-6">
                    <fieldset>
                      <div className="space-y-4">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="allowRegistration"
                              name="allowRegistration"
                              type="checkbox"
                              checked={settings.allowRegistration}
                              onChange={handleChange}
                              className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="allowRegistration" className="font-medium text-gray-700">
                              Permitir Cadastro
                            </label>
                            <p className="text-gray-500">Permitir que novos usuários criem contas.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="maintenanceMode"
                              name="maintenanceMode"
                              type="checkbox"
                              checked={settings.maintenanceMode}
                              onChange={handleChange}
                              className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                              Modo de Manutenção
                            </label>
                            <p className="text-gray-500">Colocar a aplicação em modo de manutenção.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notificationsEnabled"
                              name="notificationsEnabled"
                              type="checkbox"
                              checked={settings.notificationsEnabled}
                              onChange={handleChange}
                              className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notificationsEnabled" className="font-medium text-gray-700">
                              Ativar Notificações
                            </label>
                            <p className="text-gray-500">Enviar notificações por email aos usuários.</p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Localization Settings */}
                <div className="pt-8">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Localização</h3>
                    <p className="mt-1 text-sm text-orange-600">Configure as configurações regionais.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">
                        Moeda Padrão
                      </label>
                      <div className="mt-1">
                        <select
                          id="defaultCurrency"
                          name="defaultCurrency"
                          value={settings.defaultCurrency}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="BRL">BRL - Real Brasileiro</option>
                          <option value="USD">USD - Dólar Americano</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - Libra Esterlina</option>
                          <option value="JPY">JPY - Iene Japonês</option>
                          <option value="CAD">CAD - Dólar Canadense</option>
                          <option value="AUD">AUD - Dólar Australiano</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                        Formato de Data
                      </label>
                      <div className="mt-1">
                        <select
                          id="dateFormat"
                          name="dateFormat"
                          value={settings.dateFormat}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                    onClick={() => window.location.reload()}
                  >
                    Redefinir
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 transition-colors duration-200"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;
