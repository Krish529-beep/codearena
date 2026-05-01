import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api, { setAccessToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
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

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const googleLogin = async (credential: string) => {
    const { data } = await api.post('/auth/google', { credential });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
