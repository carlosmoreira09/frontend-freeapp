import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { RoleType, AuthType } from "../../types";
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registerType, setRegisterType] = useState<'client' | 'admin'>('client');
  const { isAuthenticated, authType } = useAuth();
  const navigate = useNavigate();

  // Check if user is authorized to access this page
  useEffect(() => {
    // If trying to register an admin, only admins can do this
    if (registerType === 'admin' && (!isAuthenticated || authType !== AuthType.ADMIN)) {
      navigate('/login');
    }
    
    // If registration is disabled, redirect to login
    const registrationEnabled = localStorage.getItem('allowRegistration') === 'true';
    if (!registrationEnabled && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authType, registerType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Register based on type
      await authService.register({
        name,
        email,
        password,
        role: registerType === 'admin' ? RoleType.ADMIN : RoleType.CLIENT
      });
      
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Falha no cadastro:', err);
      if (err instanceof Error) {
        setError('Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.');
      } else {
        setError('Ocorreu um erro desconhecido durante o cadastro');
      }
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated and not allowed to register, redirect to login
  if (!isAuthenticated && localStorage.getItem('allowRegistration') !== 'true') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white py-0 md:py-12 px-4 md:px-6">
        <div className="w-full max-w-md shadow-lg rounded-lg border border-orange-100 bg-white p-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-center text-gray-600 mb-6">
            O cadastro está desativado no momento. Por favor, entre em contato com o administrador para obter acesso.
          </p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If trying to register an admin but not authenticated as admin, redirect
  if (registerType === 'admin' && (!isAuthenticated || authType !== AuthType.ADMIN)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white py-0 md:py-12 px-4 md:px-6">
        <div className="w-full max-w-md shadow-lg rounded-lg border border-orange-100 bg-white p-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-center text-gray-600 mb-6">
            Apenas administradores podem registrar novos administradores.
          </p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:items-center md:justify-center bg-gradient-to-b from-orange-50 to-white py-0 md:py-12 px-0 md:px-6">
      {/* Mobile header - only visible on mobile */}
      <div className="bg-orange-600 w-full py-6 px-4 flex items-center justify-center md:hidden">
        <h1 className="text-white text-2xl font-bold">AppFree</h1>
      </div>
      
      <div className="w-full max-w-md md:shadow-lg md:rounded-lg md:border md:border-orange-100 md:bg-white md:p-8 p-4 flex-1 flex flex-col justify-center">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isAuthenticated && authType === AuthType.ADMIN 
              ? 'Cadastrar Novo Usuário' 
              : 'Crie sua conta'}
          </h2>
          <p className="mt-2 text-center text-sm text-orange-600">
            {isAuthenticated && authType === AuthType.ADMIN 
              ? 'Cadastre um novo usuário no sistema' 
              : 'Cadastre-se para começar a gerenciar suas finanças'}
          </p>
        </div>

        {/* Show user type selector only for admins */}
        {isAuthenticated && authType === AuthType.ADMIN && (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setRegisterType('client')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${registerType === 'client' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'}`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setRegisterType('admin')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${registerType === 'admin' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'}`}
            >
              Admin
            </button>
          </div>
        )}

        {success ? (
          <div className="rounded-md bg-green-50 p-4 border border-green-200 mt-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Cadastro realizado com sucesso!</h3>
                <p className="mt-2 text-sm text-green-700">Redirecionando para a página de login...</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 md:py-2 border border-orange-200 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-base md:text-sm"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Endereço de Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 md:py-2 border border-orange-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-base md:text-sm"
                  placeholder="Endereço de Email"
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
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 md:py-2 border border-orange-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-base md:text-sm"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirmar Senha
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 md:py-2 border border-orange-200 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-base md:text-sm"
                  placeholder="Confirmar Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 md:py-2 border border-transparent text-base md:text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:bg-orange-300 shadow-md transition-colors duration-200"
              >
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </button>
            </div>

            {!isAuthenticated && (
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                    Entrar
                  </Link>
                </p>
              </div>
            )}
          </form>
        )}
      </div>
      
      {/* Mobile footer - only visible on mobile */}
      <div className="w-full py-4 px-4 text-center text-xs text-gray-500 md:hidden">
        &copy; {new Date().getFullYear()} AppFree - Todos os direitos reservados
      </div>
    </div>
  );
};

export default RegisterPage;
