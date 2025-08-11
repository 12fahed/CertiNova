import { User } from '@/types/auth';

const AUTH_STORAGE_KEY = 'certinova_auth';
const USER_STORAGE_KEY = 'certinova_user';

export const authStorage = {
  // Save authentication state
  saveAuth: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  },

  // Get authentication state
  getAuth: (): { isAuthenticated: boolean; user: User | null } => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, user: null };
    }

    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    
    let user: User | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user from storage:', error);
      }
    }

    return { isAuthenticated: isAuth, user };
  },

  // Clear authentication state
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  // Update user data
  updateUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }
};
