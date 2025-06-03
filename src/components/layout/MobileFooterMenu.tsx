import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileFooterMenu: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        <Link
          to="/client/dashboard"
          className={`flex flex-col items-center justify-center ${
            isActive('/client/dashboard') ? 'text-orange-600' : 'text-gray-600'
          }`}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
          <span className="text-xs mt-1">Painel</span>
        </Link>

        <Link
          to="/client/transactions"
          className={`flex flex-col items-center justify-center ${
            isActive('/client/transactions') ? 'text-orange-600' : 'text-gray-600'
          }`}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <span className="text-xs mt-1">Transações</span>
        </Link>

        <Link
          to="/client/add-transaction"
          className={`flex flex-col items-center justify-center text-white bg-orange-600 rounded-full w-14 h-14 mx-auto -mt-5 ${
            isActive('/client/add-transaction') ? 'bg-orange-700' : 'bg-orange-600'
          }`}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </Link>

        <Link
          to="/client/profile"
          className={`flex flex-col items-center justify-center ${
            isActive('/client/profile') ? 'text-orange-600' : 'text-gray-600'
          }`}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileFooterMenu;
