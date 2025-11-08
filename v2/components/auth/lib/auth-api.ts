import axios, { AxiosResponse } from 'axios'
import {
  AuthResponse,
  AuthTokens,
  AuthUser,
  LoginRequest,
  SignupRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest
} from '../types/auth-types'

import { Endpoints } from '@/components/connectionManager/apiConfig'
import { authApi } from '@/components/connectionManager/http'
import Cookies from 'js-cookie'


export class AuthAPI {
  // Authentication endpoints
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await authApi.post(Endpoints.Auth.Login, credentials)
    return response.data
  }

  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await authApi.post(Endpoints.Auth.Register, userData)
    return response.data
  }

  static async logout(): Promise<void> {
    try {
      await authApi.post('/auth/logout/')
    } catch {
      // Even if logout fails on server, clear local tokens
      console.warn('Server logout failed, clearing local tokens')
    } finally {
      AuthAPI.clearTokens()
    }
  }

  static async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response: AxiosResponse<AuthTokens> = await axios.post(Endpoints.Auth.TokenRefresh, {
      refresh: refreshToken
    })
    return response.data
  }

  // Password reset endpoints
  static async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await authApi.post(Endpoints.Auth.PasswordReset, data)
    return response.data
  }

  static async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await authApi.post(Endpoints.Auth.PasswordResetConfirm, data)
    return response.data
  }

  // User profile endpoints
  static async getCurrentUser(): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await authApi.get(Endpoints.Auth.UserDetails)
    return response.data
  }

  static async updateProfile(userData: Partial<AuthUser>): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await authApi.patch(Endpoints.Auth.UserDetails, userData)
    return response.data
  }

  static async changePassword(data: { old_password: string; new_password: string }): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await authApi.post(Endpoints.Auth.PasswordChange, data)
    return response.data
  }

  // Utility methods
  static isAuthenticated(): boolean {
    const token = Cookies.get('access_token')
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch {
      return false
    }
  }

  static getAccessToken(): string | null {
    return Cookies.get('access_token') || null
  }

  static setTokens(tokens: AuthTokens): void {
    Cookies.set('access_token', tokens.access)
  }

  static clearTokens(): void {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
  }
}

export default authApi