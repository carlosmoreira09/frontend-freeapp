import React, { type ReactNode } from 'react';
import Navbar from './Navbar';
import MobileFooterMenu from './MobileFooterMenu';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>
      <MobileFooterMenu />
      <footer className="bg-orange-800 text-white py-4 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} AppFree - Liberdade | Organização | Facilidade | Orgânico. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
