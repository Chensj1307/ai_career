'use client';

import React, { useState, useEffect } from 'react';
import { getUserInfo, logout } from '@/lib/api';
import { AuthResponse } from '@/types';
import { AuthProvider } from './AuthProvider';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        // 用户未登录，保持null
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthProvider user={user} isLoading={isLoading} logout={handleLogout}>
      {children}
    </AuthProvider>
  );
}