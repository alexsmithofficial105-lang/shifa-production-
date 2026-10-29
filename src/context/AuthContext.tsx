import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client.ts';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; email: string; avatar?: string } | null;
  loading: boolean;
  login: (email: string, pass?: string) => Promise<void>;
  loginWithGoogle: (data: { email?: string; name?: string; credential?: string; avatar?: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; email: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const token = apiClient.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await apiClient.checkAuth();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, pass?: string) => {
    const res = await apiClient.login(email, pass);
    setIsAuthenticated(true);
    setUser(res.user);
  };

  const loginWithGoogle = async (data: { email?: string; name?: string; credential?: string; avatar?: string }) => {
    const res = await apiClient.loginWithGoogle(data);
    setIsAuthenticated(true);
    setUser(res.user);
  };

  const logout = async () => {
    await apiClient.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, loginWithGoogle, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
