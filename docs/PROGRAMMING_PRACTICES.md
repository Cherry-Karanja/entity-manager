# Frontend Programming Practices Guide

## Frontend Development Standards

### Last Updated: July 3, 2025

This document outlines our preferred programming practices for frontend development using Next.js, TypeScript, and Tailwind CSS. These standards ensure consistency, maintainability, and optimal performance across our codebase.

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Structure](#project-structure)
3. [TypeScript Standards](#typescript-standards)
4. [Component Development](#component-development)
5. [Styling Guidelines](#styling-guidelines)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Performance Optimization](#performance-optimization)
9. [Error Handling](#error-handling)
10. [Code Quality & Linting](#code-quality--linting)
11. [Naming Conventions](#naming-conventions)
12. [Best Practices](#best-practices)

---

## Tech Stack Overview

### Core Technologies

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Package Manager**: pnpm

### Key Libraries

- **Icons**: Lucide React
- **Charts**: Chart.js + Recharts
- **Date Handling**: date-fns
- **Notifications**: Sonner + React Hot Toast
- **Maps**: React Leaflet
- **PWA**: next-pwa

---

## Project Structure

### Directory Organization

```text
smart-attendance/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups for organization
│   ├── dashboard/         # Dashboard routes
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── common/           # Common/shared components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── sessions/         # Sessions module components
│   ├── courses/          # Courses module components
│   ├── users/            # Users module components
│   └── [feature]/        # Feature-specific components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── handler/              # API configuration and managers
│   ├── apiConfig.tsx     # Centralized API endpoints
│   ├── ApiService.tsx    # API utilities
│   └── AuthManager.tsx   # Authentication manager
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
├── utils/                # Helper utilities
└── styles/               # Global styles
```

### **CRITICAL: Modular Independence Principle**

**Every feature module MUST be completely independent and self-contained.**

#### Module Structure (Example: Sessions Module)

```text
components/sessions/
├── session-card.tsx           # Main session display component
├── attendance-session-card.tsx # Attendance-specific session view
├── make-up-session-form.tsx   # Form for creating makeup sessions
├── make-up-sessions-list.tsx  # List component for makeup sessions
└── index.ts                   # Export all components

# Each module should have:
# 1. Its own components (never import from other feature modules)
# 2. Its own types (if feature-specific)
# 3. Its own utilities (if needed)
# 4. Its own hooks (if feature-specific)
```

#### ✅ **Good Module Independence:**

```typescript
// components/sessions/session-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  // ✅ UI components OK
import { Button } from "@/components/ui/button"                                   // ✅ UI components OK
import { Badge } from "@/components/ui/badge"                                     // ✅ UI components OK
import { useApi } from "@/hooks/useApi"                                          // ✅ Shared hooks OK
import ApiService from "@/handler/ApiService"                                    // ✅ API config OK
import { AttendanceSession, Course } from "@/types"                             // ✅ Shared types OK

interface SessionCardProps {
  session: AttendanceSession
  userRole: string
  onMarkAttendance?: (sessionId: string) => void
  onViewAttendance?: (sessionId: string) => void
}

export function SessionCard({ session, userRole, onMarkAttendance }: SessionCardProps) {
  // Component uses only:
  // - UI components from components/ui/
  // - Shared hooks from hooks/
  // - Shared types from types/
  // - API configuration from handler/
  // - NO imports from other feature modules
  
  const courseApi = useApi<Course, Course>(ApiService.COURSE_URL, 1000)
  const { data: course } = courseApi.useFetchById(session.course_id || '')
  
  return (
    <Card>
      {/* Session-specific UI */}
    </Card>
  )
}
```

#### ❌ **Bad Module Dependencies:**

```typescript
// ❌ NEVER DO THIS
import { UserCard } from "@/components/users/user-card"           // ❌ Cross-module import
import { CourseSelector } from "@/components/courses/selector"    // ❌ Cross-module import
import { useUserPermissions } from "@/hooks/users/permissions"    // ❌ Feature-specific hook

// Instead, create your own component or use shared utilities
```

#### **Module Communication Rules:**

1. **Shared Dependencies (ALLOWED):**
   - `components/ui/*` - Base UI components
   - `components/common/*` - Truly shared components
   - `hooks/useApi.tsx` - Universal API hook
   - `hooks/useAuth.tsx` - Authentication hook
   - `types/*` - Shared type definitions
   - `handler/*` - API configuration
   - `utils/*` - Utility functions
   - `lib/*` - Core configurations

2. **Forbidden Dependencies:**
   - Never import from other feature modules (`components/users/*`, `components/courses/*`, etc.)
   - Never import feature-specific hooks from other modules
   - Never import feature-specific types from other modules

3. **Communication Between Modules:**
   - Use props and callbacks for parent-child communication
   - Use shared context for global state
   - Use shared types for data contracts
   - Use events or URL state for loose coupling

### File Naming Conventions

- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Pages**: `kebab-case` (e.g., `user-profile/page.tsx`)
- **Hooks**: `camelCase` starting with "use" (e.g., `useAuthUser.ts`)
- **Utils/Libs**: `camelCase` (e.g., `apiClient.ts`)
- **Types**: `PascalCase` (e.g., `UserTypes.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_ENDPOINTS.ts`)

---

## TypeScript Standards

### Type Definitions

**✅ Good:**

```typescript
// types/user.ts
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'teacher' | 'student'
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser extends User {
  permissions: string[]
  lastLogin?: Date
}

// Component props
interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  isEditing?: boolean
  className?: string
}
```

**❌ Avoid:**

```typescript
// Don't use 'any'
const userData: any = fetchUser()

// Don't use loose object types
interface Props {
  data: object
  config: {}
}
```

### Component Typing

```typescript
// Preferred component structure
import type React from "react"
import type { ComponentProps } from "react"

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "destructive"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading,
  className,
  children,
  ...props
}) => {
  // Component implementation
}
```

### API Response Types

```typescript
// types/api.ts
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

## Component Development

### Component Structure

```typescript
"use client" // Only when needed for client components

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Types
interface ComponentProps {
  // Props definition
}

// Component
const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2 = "defaultValue",
  className,
  ...restProps
}) => {
  // Hooks (in order)
  const [state, setState] = useState()
  const customHook = useCustomHook()
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  }
  
  // Early returns/guards
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorComponent error={error} />
  
  // Main render
  return (
    <div className={cn("base-classes", className)} {...restProps}>
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

### Server vs Client Components

**Use Server Components (default):**

- Static content
- Data fetching
- SEO-critical pages
- No user interaction

**Use Client Components:**

- User interactions (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- State management (useState, useContext)
- Effects (useEffect)

```typescript
// Server Component (default)
async function UserList() {
  const users = await fetchUsers() // Server-side data fetching
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// Client Component
"use client"
function InteractiveUserCard({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div onClick={() => setIsEditing(true)}>
      {/* Interactive content */}
    </div>
  )
}
```

---

## Styling Guidelines

### Tailwind CSS Best Practices

**Class Organization:**

```typescript
// Group classes logically
const buttonClasses = cn(
  // Layout
  "inline-flex items-center justify-center",
  // Spacing
  "px-4 py-2 gap-2",
  // Appearance
  "rounded-md border",
  // Typography
  "text-sm font-medium",
  // States
  "hover:bg-primary/90 focus:outline-none focus:ring-2",
  // Responsive
  "md:px-6 lg:text-base",
  // Custom
  className
)
```

**Component Variants:**

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

### CSS Custom Properties

Use CSS variables for consistent theming:

```css
/* styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}
```

### Theming System

#### Theme Provider Setup (`components/theme-provider.tsx`)

```typescript
'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Prevent SSR issues by only rendering on client side
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return children with a default theme class during SSR
    return <div className="light">{children}</div>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

#### Theme Toggle Component (`components/mode-toggle.tsx`)

```typescript
"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

#### Root Layout Integration

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## State Management

### Standard Custom Hooks

#### Universal API Hook (`hooks/useApi.tsx`)

This is our standardized hook for all CRUD operations that works with any endpoint:

```typescript
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/utils/api";
import { DjangoPaginatedResponse, ApiErrorResponse } from "@/types";

export function useApi<T, U>(url: string, pageSize: number = 10) {
  const queryClient = useQueryClient();

  // Utility function to build query string
  const buildQueryString = (params?: Record<string, number | string | boolean>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return searchParams.toString() ? `?${searchParams.toString()}` : "";
  };

  // Fetch Paginated Data (Supports Django Pagination)
  const useFetchData = (page: number, params?: Record<string, number | string | string[] | boolean | undefined>) => {
    return useQuery<DjangoPaginatedResponse<T>, AxiosError<ApiErrorResponse>>({
      queryKey: [url, page, pageSize, params],
      queryFn: async () => {
        const queryString = buildQueryString({ ...params, page, page_size: pageSize });
        const response = await api.get<DjangoPaginatedResponse<T>>(`${url}${queryString}`);
        return response.data;
      },
      placeholderData: (previousData) => previousData,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
  };

  // Fetch a Single Item by ID
  const useFetchById = (id: string | number, params?: Record<string, number | string | boolean>) => {
    return useQuery<U, AxiosError<ApiErrorResponse>>({
      queryKey: [url, id, params],
      queryFn: async () => {
        const queryString = buildQueryString(params);
        const response = await api.get<U>(`${url}${id}/${queryString}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Add Item (Supports both JSON and FormData)
  const useAddItem = useMutation<
    U,
    AxiosError<ApiErrorResponse>,
    { item?: Partial<U> | FormData; params?: Record<string, string | number | boolean> } | FormData
  >({
    mutationFn: async (arg) => {
      // Handle FormData
      if (arg instanceof FormData) {
        const response = await api.post<U>(url, arg, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      }
      
      // Handle object with FormData
      if (arg && typeof arg === "object" && arg.item instanceof FormData) {
        const queryString = buildQueryString(arg.params);
        const response = await api.post<U>(`${url}${queryString}`, arg.item, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      }
      
      // Handle JSON
      const queryString = buildQueryString(arg.params);
      const response = await api.post<U>(`${url}${queryString}`, arg.item);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] });
    },
  });

  // Update Item
  const useUpdateItem = useMutation<
    U, 
    AxiosError<ApiErrorResponse>, 
    { id: string | number; item: Partial<U>; params?: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ id, item, params }) => {
      const queryString = buildQueryString(params);
      const response = await api.patch<U>(`${url}${id}/${queryString}`, item);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] });
    },
  });

  // Delete Item
  const useDeleteItem = useMutation<
    void, 
    AxiosError<ApiErrorResponse>, 
    { id: string | number; params?: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ id, params }) => {
      const queryString = buildQueryString(params);
      const baseUrl = url.endsWith('/') ? url : `${url}/`;
      
      if (id === '') {
        await api.delete(`${baseUrl}${queryString}`);
      } else {
        await api.delete(`${baseUrl}${id}/${queryString}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] });
    },
  });

  return { useFetchData, useFetchById, useAddItem, useUpdateItem, useDeleteItem };
}
```

#### Usage Example

```typescript
// In any component
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import { User } from "@/types"

function UserList() {
  // Get the hook for User operations
  const userApi = useApi<User, User>(ApiService.USER_URL, 20)
  
  // Fetch paginated users
  const { data: usersData, isLoading } = userApi.useFetchData(1, { role: 'teacher' })
  
  // Fetch single user
  const { data: user } = userApi.useFetchById('123')
  
  // Create user mutation
  const createUser = userApi.useAddItem
  
  const handleCreateUser = () => {
    createUser.mutate({
      item: { name: 'John Doe', email: 'john@example.com' }
    })
  }
  
  // Rest of component...
}
```

### Authentication Manager

Create a centralized authentication manager (`handler/AuthManager.tsx`):

```typescript
import { 
  LOGIN_URL, 
  LOGOUT_URL, 
  REGISTER_URL, 
  TOKEN_REFRESH_URL, 
  USER_URL 
} from '@/handler/apiConfig';
import { apiPlain } from '@/utils/api';
import { User } from '@/types';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: Partial<User>;
}

class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
      // Clear existing tokens
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');

      const response = await apiPlain.post<AuthResponse>(LOGIN_URL, { 
        email, 
        password 
      });

      if (response.data) {
        // Store tokens securely
        Cookies.set('accessToken', response.data.access, { 
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        Cookies.set('refreshToken', response.data.refresh, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        return response.data;
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiPlain.post(LOGOUT_URL);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      window.location.href = '/login';
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiPlain.get<User>(`${USER_URL}me/`);
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  }
}

const authManager = new AuthManager();
export default authManager;
```

### React Context for Global State

```typescript
// contexts/auth-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"
import authManager from "@/handler/AuthManager"

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
      if (authManager.isAuthenticated()) {
        const currentUser = await authManager.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authResponse = await authManager.login(email, password)
      if (authResponse) {
        setUser(authResponse.user as User)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    authManager.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authManager.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      isAuthenticated,
      updateUser,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

## API Integration

### Standard API Configuration

Our API layer follows a standardized pattern with three main files:

#### 1. API Configuration (`handler/apiConfig.tsx`)

```typescript
/**
 * API Configuration
 * 
 * This file centralizes all API endpoints based on the backend structure.
 * All endpoints are directly extracted from backend routes and views.
 */

// Base URL Configuration - Change this based on your environment
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export { BASE_URL };

// ===================================================================
// Authentication & User Management
// ===================================================================
export const LOGIN_URL = `${BASE_URL}/api/auth/login/`;
export const LOGOUT_URL = `${BASE_URL}/api/auth/logout/`;
export const REGISTER_URL = `${BASE_URL}/api/users/register/`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/api/auth/token/refresh/`;
export const TOKEN_VERIFY_URL = `${BASE_URL}/api/auth/token/verify/`;
export const PASSWORD_RESET_URL = `${BASE_URL}/api/auth/password/reset/`;
export const PASSWORD_CHANGE_URL = `${BASE_URL}/api/auth/password/change/`;

// ===================================================================
// User Management
// ===================================================================
export const USER_URL = `${BASE_URL}/api/users/`;
export const CURRENT_USER_URL = `${BASE_URL}/api/users/me/`;
export const USER_STATISTICS_URL = `${BASE_URL}/api/users/statistics/`;
export const MASS_REGISTER_URL = `${BASE_URL}/api/users/mass_register/`;

// ===================================================================
// Feature-Specific Endpoints (Example: Sessions)
// ===================================================================
export const ATTENDANCE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/`;
export const START_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/{id}/start_session/`;
export const END_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/{id}/end_session/`;
export const CLOSE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/{id}/close_session/`;

// Add more endpoints as needed...
```

#### 2. API Service Utilities (`handler/ApiService.tsx`)

```typescript
import * as ApiService from './apiConfig';

export const withId = (url: string, id: string | number): string => {
  // Handle both {id} and :id formats
  return url.replace(/{id}/g, id.toString()).replace(/:id/g, id.toString());
};

export default ApiService;
```

#### 3. Main API Client (`utils/api.tsx`)

```typescript
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { BASE_URL, TOKEN_REFRESH_URL } from '@/handler/apiConfig';

interface ApiErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

interface AuthResponse {
    access: string;
    refresh: string;
}

interface DecodedToken {
    exp: number;
}

// Create Axios instance
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Function to check if a token is expired
const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

// Token refresh queue handler
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

// Request Interceptor with automatic token refresh
api.interceptors.request.use(
    async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        let accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        // If access token is expired, try to refresh it
        if (isTokenExpired(accessToken) && refreshToken) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const response = await axios.post<AuthResponse>(
                        TOKEN_REFRESH_URL, 
                        { refresh: refreshToken }, 
                        { withCredentials: true }
                    );

                    if (response.status === 200) {
                        accessToken = response.data.access;
                        Cookies.set('accessToken', accessToken, { 
                            expires: 1, 
                            secure: process.env.NODE_ENV === 'production', 
                            sameSite: 'Strict' 
                        });
                        onRefreshed(accessToken);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');
                    window.location.href = '/login';
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // Add authorization header
        if (accessToken && !isTokenExpired(accessToken)) {
            (config as InternalAxiosRequestConfig).headers.Authorization = `Bearer ${accessToken}`;
        }

        return config as InternalAxiosRequestConfig;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
    if (error.response && error.response.data) {
        console.error('API Error:', error.response.data);
        throw error.response.data;
    } else {
        console.error('API Error:', error.message);
        throw error;
    }
};
```

### Standard API Types

Create these types in `types/api.ts`:

```typescript
export interface ApiErrorResponse {
  detail?: string
  non_field_errors?: string[]
  [key: string]: unknown
}

export interface DjangoPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
```

---

## Performance Optimization

### Code Splitting & Lazy Loading

```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic'

const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
})

// Lazy loading with React.lazy
const LazyModal = React.lazy(() => import('./Modal'))

function App() {
  return (
    <Suspense fallback={<ModalSkeleton />}>
      <LazyModal />
    </Suspense>
  )
}
```

### Image Optimization

```typescript
import Image from 'next/image'

// Always use Next.js Image component
<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={100}
  height={100}
  priority={isAboveTheFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoize expensive calculations
const ExpensiveComponent = memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcessing(item))
  }, [data])
  
  const handleClick = useCallback((id: string) => {
    // Handle click
  }, [])
  
  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onClick={handleClick} />
      ))}
    </div>
  )
})
```

---

## Error Handling

### Error Boundaries

```typescript
// components/error-boundary.tsx
"use client"

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} />
    }

    return this.props.children
  }
}
```

### API Error Handling

```typescript
// hooks/useApiCall.ts
import { useState } from 'react'
import { toast } from 'sonner'

interface UseApiCallState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApiCall<T>() {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      toast.error(errorMessage)
      throw error
    }
  }

  return { ...state, execute }
}
```

---

## Code Quality & Linting

### ESLint Configuration

Ensure consistent code quality with proper linting rules:

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Pre-commit Hooks

```json
// package.json
{
  "scripts": {
    "pre-commit": "npm run lint && npm run typecheck"
  }
}
```

### Type Checking

```bash
# Check types without emitting files
npm run typecheck

# Watch mode for development
npm run typecheck:watch
```

---

## Naming Conventions

### Variables and Functions

```typescript
// Use camelCase
const userName = 'john_doe'
const fetchUserData = async () => {}

// Use descriptive names
const isUserAuthenticated = checkAuth() // ✅ Good
const isAuth = checkAuth() // ❌ Too short

// Boolean variables should be questions
const isLoading = true
const hasPermission = false
const canEdit = userRole === 'admin'
```

### Constants

```typescript
// Use SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3
const DEFAULT_PAGE_SIZE = 20
```

### Event Handlers

```typescript
// Use handle prefix
const handleSubmit = () => {}
const handleUserClick = () => {}
const handleModalClose = () => {}

// Use on prefix for props
interface Props {
  onSubmit?: () => void
  onUserClick?: (user: User) => void
  onModalClose?: () => void
}
```

---

## Best Practices

### General Principles

1. **Single Responsibility**: Each component should have one clear purpose
2. **DRY (Don't Repeat Yourself)**: Extract common logic into hooks or utilities
3. **Composition over Inheritance**: Use composition patterns for reusability
4. **Explicit over Implicit**: Be explicit about dependencies and data flow
5. **Performance First**: Consider performance implications of every decision
6. **Modular Independence**: Feature modules must be completely independent

### Component Guidelines

```typescript
// ✅ Good: Small, focused component
const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => (
  <Image
    src={user.avatar}
    alt={`${user.name} avatar`}
    className={cn(avatarSizes[size])}
  />
)

// ❌ Avoid: Large, multi-purpose component
const UserComponent = ({ user, showDetails, allowEdit, onSave }) => {
  // Too many responsibilities
}
```

### Hook Guidelines

```typescript
// ✅ Good: Custom hook with clear purpose
const useUserPermissions = (userId: string) => {
  const { data: user } = useUser(userId)
  
  return useMemo(() => ({
    canEdit: user?.role === 'admin',
    canDelete: user?.role === 'admin',
    canView: true,
  }), [user?.role])
}

// Use the hook
const { canEdit, canDelete } = useUserPermissions(user.id)
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'teacher', 'student']),
})

type UserFormData = z.infer<typeof userSchema>

const UserForm = ({ onSubmit }: { onSubmit: (data: UserFormData) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

### Environment Variables

```typescript
// lib/env.ts
const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL!,
  APP_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL!,
} as const

// Validate environment variables
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
})

export default env
```

---

## Project Setup Guide

When starting a new project with this guide, follow these steps:

### 1. Core File Structure Setup

Create these essential files first:

```text
src/
├── handler/
│   ├── apiConfig.tsx      # Copy from template
│   ├── ApiService.tsx     # Copy from template  
│   └── AuthManager.tsx    # Copy from template
├── hooks/
│   └── useApi.tsx         # Copy from template
├── utils/
│   └── api.tsx           # Copy from template
├── types/
│   └── api.ts            # Copy from template
├── components/
│   ├── theme-provider.tsx # Copy from template
│   └── mode-toggle.tsx    # Copy from template
└── contexts/
    └── auth-context.tsx   # Copy from template
```

### 2. Package Dependencies

Install these core dependencies:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.75.7",
    "@hookform/resolvers": "^3.9.1",
    "react-hook-form": "^7.54.1",
    "zod": "^3.24.1",
    "axios": "^1.9.0",
    "js-cookie": "^3.0.5",
    "jwt-decode": "^4.0.0",
    "next-themes": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "sonner": "^1.7.4"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6",
    "typescript": "^5.8.3"
  }
}
```

### 3. Configuration Files

#### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

### 4. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### 5. Module Creation Template

For each new feature module, follow this structure:

```typescript
// components/[module]/index.ts
export { default as ModuleCard } from './module-card'
export { default as ModuleForm } from './module-form'
export { default as ModuleList } from './module-list'

// types/[module].ts
export interface ModuleType {
  id: string
  name: string
  // ... other properties
}

// In your module components, always use:
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import { ModuleType } from "@/types"

const moduleApi = useApi<ModuleType, ModuleType>(ApiService.MODULE_URL)
```

---

## Conclusion

This guide serves as our foundation for consistent, maintainable, and performant frontend development. As our project evolves, we'll update these practices to reflect new learnings and requirements.

**Key Takeaways:**

- Prioritize TypeScript type safety
- Use server components by default, client components when needed
- Leverage Tailwind CSS with design system patterns
- Implement proper error handling and loading states
- Focus on performance and accessibility
- Maintain consistent code style and naming conventions

For questions or suggestions about these practices, please reach out to the development team.

---

*This document is a living guide and should be updated as our practices evolve.*
