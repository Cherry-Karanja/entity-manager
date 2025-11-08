import { LOGIN_URL, BASE_URL, REGISTRATION_URL, TOKEN_REFRESH_URL as REFRESH_TOKEN_URL, USER_DETAILS_URL, LOGOUT_URL, PASSWORD_RESET_URL, PASSWORD_RESET_CONFIRM_URL } from '@/handler/apiConfig';
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse, User} from '@/types';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { api,handleApiError } from '@/utils/api';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
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
        const response = await apiPlain.post<AuthResponse>(LOGIN_URL, {
          email,
          password
        });

        // Backend automatically sets HTTP-only cookies, no need to store them manually
        return response.data;
    } catch (error) {
      console.error('Login error:', error);
      await handleApiError(error, 'Login failed');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(LOGOUT_URL);
      // Backend automatically clears HTTP-only cookies
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear any client-side cookies as fallback
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  }

  async register(userData: { email: string; password1: string; password2: string }): Promise<AuthResponse | undefined> {
    try {
      const response = await apiPlain.post<AuthResponse>(REGISTRATION_URL, userData);

      // Backend automatically sets HTTP-only cookies, no need to store them manually
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      await handleApiError(error, 'Registration failed');
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const response = await api.get<User>(USER_DETAILS_URL);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiPlain.post(PASSWORD_RESET_URL, { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      await handleApiError(error, 'Failed to send password reset email');
      throw error;
    }
  }

  async resetPassword(uid: string, token: string, newPassword1: string, newPassword2: string): Promise<void> {
    try {
      await apiPlain.post(PASSWORD_RESET_CONFIRM_URL, {
        uid,
        token,
        new_password1: newPassword1,
        new_password2: newPassword2
      });
    } catch (error) {
      console.error('Reset password error:', error);
      await handleApiError(error, 'Failed to reset password');
      throw error;
    }
  }

  clearAuth(): void {
    // Clear any client-side cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  isAuthenticated(): boolean {
    // With HTTP-only cookies, we can't check client-side
    // This will be checked by making API requests
    return true; // Assume authenticated, let API handle 401 errors
  }

  getToken(): string | undefined {
    // With HTTP-only cookies, tokens are not accessible to JavaScript
    return undefined;
  }
}

const authManager = new AuthManager();
export default authManager;