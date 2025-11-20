import { z } from 'zod'

// Auth API Response Types
export interface AuthUser {
  id: number
  email: string
  first_name: string
  last_name: string
  username: string
  is_active: boolean
  created_at: string
  last_login: string
  role?: string
  profile?: {
    avatar?: string
    phone?: string
    department?: string
  }
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  username?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  password: string
  password_confirm: string
}

// Form Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  password_confirm: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
})

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const passwordResetConfirmSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>

// Union type for all auth form data
export type AuthFormData =
  | LoginFormData
  | SignupFormData
  | PasswordResetFormData
  | PasswordResetConfirmFormData