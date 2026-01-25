import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: number;
  firstName: string;
  lastName?: string;
  isAdmin: boolean;
  roleId?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: { FirstName: string; LastName: string; Email: string; PhoneNumber: string; Password: string }) => Promise<{ error?: string }>;
  adminRegister: (data: { FirstName: string; LastName: string; Email: string; Password: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Listen for auto-logout events from API
    const handleAutoLogout = () => {
      setUser(null);
      window.location.href = '/login';
    };
    
    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await authApi.login(email, password);
    
    if (error) return { error };
    
    if (data) {
      localStorage.setItem('access_token', data.access_token);
      const userData: User = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        isAdmin: false,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    
    return {};
  };

  const adminLogin = async (email: string, password: string) => {
    const { data, error } = await authApi.adminLogin(email, password);
    
    if (error) return { error };
    
    if (data) {
      localStorage.setItem('access_token', data.access_token);
      const userData: User = {
        id: data.user.id,
        firstName: data.user.firstName,
        isAdmin: true,
        roleId: data.user.RoleID,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    
    return {};
  };

  const register = async (data: { FirstName: string; LastName: string; Email: string; PhoneNumber: string; Password: string }) => {
    const { error } = await authApi.register(data);
    return { error };
  };

  const adminRegister = async (data: { FirstName: string; LastName: string; Email: string; Password: string }) => {
    const { error } = await authApi.adminRegister(data);
    return { error };
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, adminLogin, register, adminRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
