import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthType } from '../../types';
import {LogOutIcon} from "lucide-react";

const Navbar: React.FC = () => {
  const { isAuthenticated, authType, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // For client users on mobile, we only show a simplified header
  const isClientOnMobile = isAuthenticated && authType === AuthType.CLIENT;

  return (
    <nav className="bg-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">FreeApp</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {isAuthenticated && authType === AuthType.ADMIN && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Painel
                    </Link>
                    <Link
                        to="/admin/transactions"
                        className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Transções de Clientes
                    </Link>
                    <Link
                      to="/admin/clients"
                      className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Gerenciar Clientes
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="hidden text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Configurações
                    </Link>
                  </>
                )}
                {isAuthenticated && authType === AuthType.CLIENT && (
                  <>
                    <Link
                      to="/client/dashboard"
                      className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Painel
                    </Link>
                    <Link
                      to="/client/transactions"
                      className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Transações
                    </Link>
                    <Link
                      to="/client/profile"
                      className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Perfil
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sair
                </button>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/register"
                    className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Cadastrar
                  </Link>
                  <Link
                    to="/login"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Entrar
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button - only show for admin or non-authenticated users */}
          {(!isClientOnMobile || !isAuthenticated) && (
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-orange-100 hover:text-white hover:bg-orange-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menu principal</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          
          {/* Client avatar on mobile */}
          {isClientOnMobile && (
            <div className="flex md:hidden">
              <LogOutIcon
                  size={35}
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-orange-300 hover:text-white hover:bg-orange-700 transition-colors duration-200"
              >
                Sair
              </LogOutIcon>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && authType === AuthType.ADMIN && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-orange-100 hover:bg-orange-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Painel
                </Link>
                <Link
                    to="/admin/transactions"
                    className="text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Transções de Clientes
                </Link>
                <Link
                  to="/admin/clients"
                  className="text-orange-100 hover:bg-orange-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Gerenciar Clientes
                </Link>
                <Link
                  to="/admin/settings"
                  className="hidden text-orange-100 hover:bg-orange-700 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Configurações
                </Link>
              </>
            )}
            {isAuthenticated && authType === AuthType.CLIENT && (
              <>
                {/* Client mobile links are now handled by the footer menu */}
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="text-orange-100 hover:bg-orange-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Cadastrar
                </Link>
                <Link
                  to="/login"
                  className="text-orange-100 hover:bg-orange-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
