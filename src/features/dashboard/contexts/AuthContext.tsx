//features/dashboard/context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
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

// 개발용 기본값 (AuthProvider 없이도 작동)
const defaultAuthValue: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    console.log('Auth not configured - login called with:', { email });
    // 개발 모드에서는 성공한 것처럼 처리
    return Promise.resolve();
  },
  logout: () => {
    console.log('Auth not configured - logout called');
  },
  refreshUser: async () => {
    console.log('Auth not configured - refreshUser called');
    return Promise.resolve();
  },
};

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
      const decoded: any = jwtDecode(token);
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

// 에러를 던지지 않고 기본값을 반환하는 useAuth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  // AuthProvider가 없으면 기본값 반환 (개발 단계용)
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ useAuth: AuthProvider not found, using default values. ' +
        'This is normal during development if auth is not yet configured.'
      );
    }
    return defaultAuthValue;
  }
  
  return context;
};

// 옵셔널 버전의 useAuth (에러를 던지지 않음)
export const useOptionalAuth = (): AuthContextType | null => {
  return useContext(AuthContext) || null;
};

// 인증 상태만 확인하는 간단한 훅
export const useIsAuthenticated = (): boolean => {
  const auth = useOptionalAuth();
  return auth?.isAuthenticated ?? false;
};