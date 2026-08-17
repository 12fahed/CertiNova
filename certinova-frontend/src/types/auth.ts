export interface User {
  id: string;
  organisation: string;
  email: string;
  createdAt: string;

  fullName?: string;
  organizationLogo?: string;
  eventTypes?: string;
  referralSource?: string;
  onboardingCompleted?: boolean;
}

export interface OnboardingData {
  email: string;
  fullName: string;
  organisation: string;
  organizationLogo?: string | null;
  eventTypes: string;
  referralSource?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
  errors?: string[];
}

export interface SignupData {
  organisation: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  completeOnboarding: (data: OnboardingData) => Promise<boolean>;
  logout: () => void;
}
