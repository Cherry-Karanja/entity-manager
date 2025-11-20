'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, SignupRequest } from '@/components/auth/types/auth-types'
import { AuthAPI } from '@/components/auth/lib/auth-api'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignupRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const userData = await AuthAPI.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      AuthAPI.clearTokens()
      setUser(null)
      throw error
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthAPI.isAuthenticated() && !user) {
          const userData = await AuthAPI.getAuthUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        AuthAPI.clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      AuthAPI.clearTokens()
      const response = await AuthAPI.login({ email, password })
      AuthAPI.setTokens(response)
      AuthAPI.setAuthUser(response.user)
      setUser(response.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupRequest) => {
    try {
      setIsLoading(true)
      const response = await AuthAPI.signup(userData)
      AuthAPI.setTokens(response)
      AuthAPI.setAuthUser(response.user)
      setUser(response.user)
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await AuthAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      AuthAPI.clearTokens()
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && AuthAPI.isAuthenticated(),
    login,
    signup,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}