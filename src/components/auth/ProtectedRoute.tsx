import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthType } from '../../types';

interface ProtectedRouteProps {
  allowedAuthTypes?: AuthType[];
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedAuthTypes = [AuthType.USER, AuthType.CLIENT, AuthType.ADMIN],
  adminOnly = false
}) => {
  const { isAuthenticated, authType, loading } = useAuth();
  const location = useLocation();

  // Show loading state if still checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If admin-only route and not admin, redirect
  if (adminOnly && authType !== AuthType.ADMIN) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but wrong type, redirect to appropriate dashboard
  if (authType && !allowedAuthTypes.includes(authType)) {
    if (authType === AuthType.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (authType === AuthType.CLIENT) {
      return <Navigate to="/client/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and correct type, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
