export interface User {
  id: string;
  organisation: string;
  email: string;
  fullName?: string;
  avatar?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
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

export interface UpdateProfileData {
  fullName?: string;
  eventTypes?: string;
  referralSource?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
}
