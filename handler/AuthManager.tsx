import { LOGIN_URL, BASE_URL, REGISTRATION_URL, TOKEN_REFRESH_URL as REFRESH_TOKEN_URL, USER_DETAILS_URL, LOGOUT_URL } from '@/handler/apiConfig';
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse, User} from '@/types';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { api,handleApiError } from '@/utils/api';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: Partial<User>;
}

export const apiPlain = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
        // Clear tokens synchronously before making the API call
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        const response = await apiPlain.post<AuthResponse>(LOGIN_URL, {
          email,
          password
        });

        if (response.data) {
          // Store new tokens after successful login in cookies
          Cookies.set('access_token', response.data.access, {
            expires: 1, // 1 day expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          Cookies.set('refresh_token', response.data.refresh, {
            expires: 7, // 7 days expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          return response.data;
        }
    } catch (error) {
      console.error('Login error:', error);
      await handleApiError(error, 'Login failed');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(LOGOUT_URL);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  }

  async register(userData: { email: string; password1: string; password2: string }): Promise<AuthResponse | undefined> {
    try {
      const response = await apiPlain.post<AuthResponse>(REGISTRATION_URL, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      await handleApiError(error, 'Registration failed');
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>(USER_DETAILS_URL);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getUser(): Promise<User | null> {
    return this.getCurrentUser();
  }

  clearAuth(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  isAuthenticated(): boolean {
    const token = Cookies.get('access_token');
    return !!token;
  }

  getToken(): string | undefined {
    return Cookies.get('access_token');
  }
}

export default new AuthManager();