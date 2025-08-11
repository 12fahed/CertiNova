import { AuthResponse, LoginData, SignupData } from '@/types/auth';

const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async signup(userData: SignupData): Promise<AuthResponse> {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(userData: LoginData): Promise<AuthResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export const authService = new AuthService();
