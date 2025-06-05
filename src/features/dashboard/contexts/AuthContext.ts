//features/dashboard/context/AuthContext.ts

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import jwt_decode from 'jwt-decode';
import { apiClient } from '@/lib/api/client';
import { getAuthToken, setAuthToken, setRefreshToken, removeAuthToken } from '@/lib/api/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // 토큰 유효성 검사
      const decoded: any = jwt_decode(token);
      if (decoded.exp * 1000 < Date.now()) {
        removeAuthToken();
        setIsLoading(false);
        return;
      }

      // 사용자 정보 가져오기
      await refreshUser();
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{
        access: string;
        refresh: string;
        user: User;
      }>('/auth/jwt/create/', { email, password });

      setAuthToken(response.access);
      setRefreshToken(response.refresh);
      setUser(response.user);
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<User>('/auth/users/me/');
      setUser(response);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};