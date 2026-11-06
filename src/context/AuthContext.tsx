import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client.ts';
import {
  isFirebaseActive,
  getFirebaseAuth,
  loginWithFirebaseAuth,
  logoutFirebaseAuth,
  subscribeToFirebaseAuth,
} from '../services/firebase.ts';

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

  // Sync with Firebase Auth state
  useEffect(() => {
    if (isFirebaseActive() && getFirebaseAuth()) {
      const unsub = subscribeToFirebaseAuth((fbUser) => {
        if (fbUser) {
          setIsAuthenticated(true);
          setUser({
            username: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
            email: fbUser.email || '',
          });
          setLoading(false);
        } else {
          checkAuth();
        }
      });
      return () => {
        unsub?.();
      };
    } else {
      checkAuth();
    }
  }, []);

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

  const login = async (email: string, pass?: string) => {
    // 1. Try Firebase Authentication first if Firebase is active
    if (isFirebaseActive() && getFirebaseAuth() && pass) {
      try {
        const fbUser = await loginWithFirebaseAuth(email, pass);
        setIsAuthenticated(true);
        setUser({
          username: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
          email: fbUser.email || email,
        });
        // Also sync with server token for hybrid routes
        try {
          await apiClient.login(email, pass);
        } catch {
          // Firebase auth is sufficient
        }
        return;
      } catch (err: any) {
        console.warn('Firebase Auth note:', err?.message || err);
        // If user doesn't exist in Firebase Auth yet, try server authentication
      }
    }

    // 2. Fallback to API Client
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
    try {
      await logoutFirebaseAuth();
    } catch {
      // fallback
    }
    try {
      await apiClient.logout();
    } catch {
      // fallback
    }
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
