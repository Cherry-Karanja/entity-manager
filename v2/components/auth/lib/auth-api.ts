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
import Cookies from 'js-cookie'


export class AuthAPI {
  // Authentication endpoints
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<AuthResponse> = await authApi.post(Endpoints.Auth.Login, credentials)
    return response.data
  }

  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<AuthResponse> = await authApi.post(Endpoints.Auth.Register, userData)
    return response.data
  }

  static async logout(): Promise<void> {
    try {
      const { authApi } = await import('@/components/connectionManager/http')
      await authApi.post('/auth/logout/')
    } catch {
      // Even if logout fails on server, clear local tokens
      console.warn('Server logout failed, clearing local tokens')
    } finally {
      AuthAPI.clearTokens()
    }
  }

  static async refreshToken(): Promise<AuthTokens> {
    // cookies already contain the refresh token
    const response: AxiosResponse<AuthTokens> = await axios.post(Endpoints.Auth.TokenRefresh)
    return response.data
  }

  // Password reset endpoints
  static async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<{ message: string }> = await authApi.post(Endpoints.Auth.PasswordReset, data)
    return response.data
  }

  static async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<{ message: string }> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<{ message: string }> = await authApi.post(Endpoints.Auth.PasswordResetConfirm, data)
    return response.data
  }

  // User profile endpoints
  static async getCurrentUser(): Promise<AuthUser> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<AuthUser> = await authApi.get(Endpoints.Auth.UserDetails)
    return response.data
  }

  static async updateProfile(userData: Partial<AuthUser>): Promise<AuthUser> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<AuthUser> = await authApi.patch(Endpoints.Auth.UserDetails, userData)
    return response.data
  }

  static async changePassword(data: { old_password: string; new_password: string }): Promise<{ message: string }> {
    const { authApi } = await import('@/components/connectionManager/http')
    const response: AxiosResponse<{ message: string }> = await authApi.post(Endpoints.Auth.PasswordChange, data)
    return response.data
  }

  // Utility methods
  static isAuthenticated(): boolean {
    const token = AuthAPI.getAccessToken()
    const user = AuthAPI.getAuthUser()
    if (!token || !user) return false

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

  static getAuthUser(): AuthUser | null {
    const userJson = Cookies.get('auth_user')
    if (!userJson) return null
    return JSON.parse(userJson)
  }

  static setTokens(tokens: AuthTokens): void {
    // Cookies.set('access_token', tokens.access)
  }

  static setAuthUser(user: AuthUser): void {
    Cookies.set('auth_user', JSON.stringify(user))
  }

  static clearTokens(): void {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    Cookies.remove('auth_user')
  }
}