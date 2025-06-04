import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'client' | 'admin'>('client');
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if registration is enabled
    const isRegistrationEnabled = localStorage.getItem('allowRegistration') === 'true';
    setRegistrationEnabled(isRegistrationEnabled);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
     const result = await login(email, password);
      // Redirect based on login type
      if (loginType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error('Falha no login:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex flex-col md:items-center md:justify-center py-0 md:py-20 px-0 md:px-6">
      {/* Mobile header - only visible on mobile */}
      <div className="bg-orange-600 w-full py-6 px-4 flex items-center justify-center md:hidden">
        <h1 className="text-white text-2xl font-bold">FreeApp</h1>
      </div>
      
      <div className="w-full max-w-md md:shadow-lg md:rounded-lg md:border md:border-orange-100 md:bg-white md:p-8 p-4 flex-1 flex flex-col justify-center">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {loginType === 'client' ? 'Cliente' : 'Administrador'}
          </h2>
          <p className="mt-2 text-center text-sm text-orange-600">
            Acesse sua conta de {loginType === 'client' ? 'cliente' : 'administrador'}
          </p>
        </div>
        
        {/* Seletor de tipo de login */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={() => setLoginType('client')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${loginType === 'client' 
              ? 'bg-orange-500 text-white shadow-md' 
              : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'}`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${loginType === 'admin' 
              ? 'bg-orange-500 text-white shadow-md' 
              : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'}`}
          >
            Admin
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Endereço de email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 md:py-2 border border-orange-200 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-base md:text-sm"
                placeholder="Endereço de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 md:py-2 border border-orange-200 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-base md:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-orange-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 md:py-2 border border-transparent text-base md:text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:bg-orange-300 shadow-md transition-colors duration-200"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {loginType === 'client' && registrationEnabled && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
                  Cadastre-se agora
                </Link>
              </p>
            </div>
          ) || (
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <a 
                    href="https://wa.me/5511971267641?text=Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Free%20App%20%3F"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    Entre em contato
                  </a>
                </p>
              </div>
          )}

        </form>
      </div>
      
      {/* Mobile footer - only visible on mobile */}
      <div className="w-full py-4 px-4 text-center text-xs text-gray-500 md:hidden">
        &copy; {new Date().getFullYear()} FreeApp - Todos os direitos reservados
      </div>
    </div>
  );
};

export default LoginPage;
