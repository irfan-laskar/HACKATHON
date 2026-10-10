import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  becomeCreator: (data: { channelName?: string; bio?: string }) => Promise<void>;
  toggleFollow: (creatorId: string) => Promise<{ isFollowing: boolean; followersCount: number }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('token');
    setUser(null);
  };

  const becomeCreator = async (data: { channelName?: string; bio?: string }) => {
    const res = await api.post('/auth/become-creator', data);
    if (res.data.success) {
      setUser(res.data.user);
    }
  };

  const toggleFollow = async (creatorId: string) => {
    const res = await api.post(`/auth/follow/${creatorId}`);
    if (res.data.success && user) {
      await fetchCurrentUser();
      return res.data;
    }
    return { isFollowing: false, followersCount: 0 };
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        becomeCreator,
        toggleFollow,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
