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
          const email = fbUser.email?.trim().toLowerCase();
          if (email !== 'shifaproductions.pk@gmail.com') {
            console.warn(`Unauthorized Google account attempted login: ${email}`);
            logoutFirebaseAuth().catch(() => {});
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return;
          }
          setIsAuthenticated(true);
          setUser({
            username: fbUser.displayName || 'SHIFA PRODUCTIONS',
            email: 'shifaproductions.pk@gmail.com',
            avatar: fbUser.photoURL || undefined,
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
      if (data.authenticated && data.user && data.user.email?.toLowerCase() === 'shifaproductions.pk@gmail.com') {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        apiClient.clearToken();
        localStorage.removeItem('shifa_admin_user');
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      apiClient.clearToken();
      localStorage.removeItem('shifa_admin_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (_identifier: string, _pass?: string) => {
    throw new Error('Access Denied: Username and password login is completely locked. Please sign in using "Continue with Google" with shifaproductions.pk@gmail.com.');
  };

  const loginWithGoogle = async (data: { email?: string; name?: string; credential?: string; avatar?: string }) => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    if (cleanEmail !== 'shifaproductions.pk@gmail.com') {
      throw new Error(`Access Denied: The Google account "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com has access to the Admin Panel. (صرف shifaproductions.pk@gmail.com کو رسائی حاصل ہے)`);
    }
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
