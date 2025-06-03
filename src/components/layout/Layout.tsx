import React, { type ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-orange-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} AppFree - Liberdade | Organização | Facilidade | Orgânico. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
