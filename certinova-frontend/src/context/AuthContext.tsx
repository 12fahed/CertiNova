'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, LoginData, SignupData, User } from '@/types/auth';
import { authService } from '@/services/auth';
import { authStorage } from '@/lib/auth-storage';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OnboardingModal } from '@/components/onboarding-modal';

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

interface OnboardingData {
  email: string;
  fullName: string;
  organisation: string;
  organizationLogo?: string | null;
  eventTypes: string;
  referralSource?: string | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
        if (userData.onboardingCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
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

  const completeOnboarding = async (data: OnboardingData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await authService.completeOnboarding(data);

      if (response.success && response.data?.user) {
        const userData = response.data.user;

        setUser(userData);
        setIsAuthenticated(true);
        authStorage.saveAuth(userData);

        toast.success('Onboarding completed successfully!');

        return true;
      } else {
        const errorMessage = response.errors ? response.errors.join(', ') : response.message;

        toast.error(errorMessage || 'Failed to complete onboarding');

        return false;
      }
    } catch (error: unknown) {
      console.error('Onboarding error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';

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
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    completeOnboarding,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
