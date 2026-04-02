import React, { createContext, useContext, ReactNode } from 'react';
import { AuthResponse } from '@/types';

interface AuthContextType {
  user: AuthResponse | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  user: AuthResponse | null;
  isLoading: boolean;
  logout: () => void;
}

export function AuthProvider({ children, user, isLoading, logout }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}