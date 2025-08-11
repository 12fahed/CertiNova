"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, LoginData, SignupData, User } from '@/types/auth';
import { authService } from '@/services/auth';
import { authStorage } from '@/lib/auth-storage';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    const { isAuthenticated: storedAuth, user: storedUser } = authStorage.getAuth();
    setIsAuthenticated(storedAuth);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        authStorage.saveAuth(userData);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        authStorage.saveAuth(userData);
        toast.success('Account created successfully!');
        return true;
      } else {
        const errorMessage = response.errors ? response.errors.join(', ') : response.message;
        toast.error(errorMessage || 'Signup failed');
        return false;
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authStorage.clearAuth();
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
