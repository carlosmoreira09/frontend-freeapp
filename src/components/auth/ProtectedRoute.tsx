import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthType } from '../../types';

interface ProtectedRouteProps {
  allowedAuthTypes?: AuthType[];
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedAuthTypes = [AuthType.CLIENT, AuthType.ADMIN],
  adminOnly = false
}) => {
  const { isAuthenticated, authType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  if (adminOnly && authType !== AuthType.ADMIN) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authType && !allowedAuthTypes.includes(authType)) {
    if (authType === AuthType.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (authType === AuthType.CLIENT) {
      return <Navigate to="/client/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
