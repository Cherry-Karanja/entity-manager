"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"
import authManager from "@/handler/AuthManager"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Try to get user data from server - this will fail if not authenticated
      console.debug('Checking authentication by fetching user data...');
      const userData = await authManager.getUser()
      if (userData) {
        await setUser(userData as User)
        await setIsAuthenticated(true)
        console.debug('User is authenticated');
      } else {
        await setIsAuthenticated(false)
        console.debug('User is not authenticated');
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      authManager.clearAuth()
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authManager.login(email, password)
      
      if (response && response.user) {
        await setUser(response.user as User)
        await setIsAuthenticated(true)
        
        // Fetch complete user data
        try {
          const completeUserData = await authManager.getUser()
          if (completeUserData) {
            await setUser(completeUserData as User)
          }
        } catch (error) {
          console.error('Failed to fetch complete user data:', error)
        }
        
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      await setIsAuthenticated(false)
      await setUser(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authManager.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      await setUser(null)
      await setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      await setUser(updatedUser)
    }
  }
  const refreshUser = async () => {
    try {
      if (isAuthenticated) {
        const userData = await authManager.getUser()
        if (userData) {
          await setUser(userData as User)
        }
      }
    } catch (error: unknown) {
      console.error('Failed to refresh user data:', error)
      // If refresh fails, might need to re-authenticate
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response?.status === 401
      ) {
        await setUser(null)
        await setIsAuthenticated(false)
        authManager.clearAuth()
      }
    }
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    updateUser,
    refreshUser
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
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}