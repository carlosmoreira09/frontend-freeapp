import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService from "../services/authService.ts";
import { AuthType, type Client, type User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  client: Client | null;
  authType: AuthType | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateClientProfile: (profileData: Partial<Client>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [authType, setAuthType] = useState<AuthType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const storedAuthType = localStorage.getItem('authType') as AuthType;
          setAuthType(storedAuthType);
          setIsAuthenticated(true);
          
          if (storedAuthType === AuthType.ADMIN) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              setUser(JSON.parse(userStr));
            }
          } else if (storedAuthType === AuthType.CLIENT) {
            const clientStr = localStorage.getItem('client');
            if (clientStr) {
              setClient(JSON.parse(clientStr));
            }
          } else if (storedAuthType === AuthType.ADMIN) {
            const clientStr = localStorage.getItem('admin');
            if (clientStr) {
              setClient(JSON.parse(clientStr));
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setIsAuthenticated(true);
      setAuthType(response.type);
      console.log(response)
      if (response.type === AuthType.ADMIN && response.user) {
        setUser(response.user);
        setClient(null);
      } else if (response.type === AuthType.CLIENT && response.client) {
        setClient(response.client);
        setUser(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setClient(null);
    setAuthType(null);
  };

  const clearError = () => {
    setError(null);
  };

  const updateClientProfile = async (profileData: Partial<Client>) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would call the actual API endpoint to update the profile
      // const updatedClient = await authService.updateProfile(profileData);
      
      // For now, just simulate an API call and update the local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (client) {
        const updatedClient = { ...client, ...profileData };
        setClient(updatedClient);
        
        // Update localStorage
        localStorage.setItem('client', JSON.stringify(updatedClient));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while updating profile');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    client,
    authType,
    loading,
    error,
    login,
    logout,
    clearError,
    updateClientProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
