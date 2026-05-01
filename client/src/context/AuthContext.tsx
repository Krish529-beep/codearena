import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api, { setAccessToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  googleLogin: (credential: string) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAuthPayload = useCallback((data: { accessToken: string; user: User }) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh', {});
      applyAuthPayload(data);
    } catch {
      clearAuth();
    }
  }, [applyAuthPayload, clearAuth]);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await api.post('/auth/refresh', {});
        applyAuthPayload(data);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [applyAuthPayload, clearAuth]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return applyAuthPayload(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return applyAuthPayload(data);
  };

  const googleLogin = async (credential: string) => {
    const { data } = await api.post('/auth/google', { credential });
    return applyAuthPayload(data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {}
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
