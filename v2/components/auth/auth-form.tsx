'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  loginSchema,
  signupSchema,
  passwordResetSchema,
  passwordResetConfirmSchema,
  type SignupRequest,
  type PasswordResetRequest,
  type PasswordResetConfirmRequest
} from '@/components/auth/types/auth-types'
import { AuthAPI } from '@/components/auth/lib/auth-api'
import { useAuth } from '@/components/auth/contexts/auth-context'
import Link from 'next/link'

type AuthMode = 'login' | 'signup' | 'reset' | 'reset-confirm'

interface AuthFormProps {
  mode: AuthMode
  token?: string
  onSuccess?: () => void
  onModeChange?: (mode: AuthMode) => void
}

export function AuthForm({ mode, token, onSuccess, onModeChange }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { login, signup, isLoading } = useAuth()

  const getSchema = () => {
    switch (mode) {
      case 'login': return loginSchema
      case 'signup': return signupSchema
      case 'reset': return passwordResetSchema
      case 'reset-confirm': return passwordResetConfirmSchema
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(getSchema() as any),
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      setError('')
      switch (mode) {
        case 'login':
          await login(data.email as string, data.password as string)
          onSuccess?.()
          break
        case 'signup':
          await signup(data as unknown as SignupRequest)
          onSuccess?.()
          break
        case 'reset':
          await AuthAPI.requestPasswordReset(data as unknown as PasswordResetRequest)
          setSuccess(true)
          break
        case 'reset-confirm':
          if (!token) throw new Error('Token required')
          await AuthAPI.confirmPasswordReset({ ...data, token } as unknown as PasswordResetConfirmRequest)
          setSuccess(true)
          break
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string; non_field_errors?: string[]; email?: string[] } } }
      setError(
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.email?.[0] ||
        'An error occurred. Please try again.'
      )
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In'
      case 'signup': return 'Create Account'
      case 'reset': return 'Reset Password'
      case 'reset-confirm': return 'Set New Password'
    }
  }

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Enter your credentials to access your account'
      case 'signup': return 'Enter your information to create your account'
      case 'reset': return 'Enter your email and we&apos;ll send you a reset link'
      case 'reset-confirm': return 'Enter your new password below'
    }
  }

  if (success && mode === 'reset') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a reset link to {getValues('email')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Check your inbox and spam folder. Link expires in 24 hours.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSuccess(false)
                reset()
              }}
            >
              Try Different Email
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (success && mode === 'reset-confirm') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Password Reset</CardTitle>
          <CardDescription className="text-center">Your password has been reset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              You can now sign in with your new password.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{getTitle()}</CardTitle>
        <CardDescription className="text-center">{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field - All modes */}
          {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{String(errors.email.message || errors.email)}</p>
              )}
            </div>
          )}

          {/* Name Fields - Signup only */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  {...register('first_name')}
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{String(errors.first_name.message || errors.first_name)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  {...register('last_name')}
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{String(errors.last_name.message || errors.last_name)}</p>
                )}
              </div>
            </div>
          )}

          {/* Password Fields */}
          {(mode === 'login' || mode === 'signup' || mode === 'reset-confirm') && (
            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === 'reset-confirm' ? 'New Password' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'reset-confirm' ? 'Enter new password' : 'Enter password'}
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{String(errors.password.message || errors.password)}</p>
              )}
            </div>
          )}

          {/* Confirm Password - Signup and Reset Confirm */}
          {(mode === 'signup' || mode === 'reset-confirm') && (
            <div className="space-y-2">
              <Label htmlFor="password_confirm">
                {mode === 'reset-confirm' ? 'Confirm New Password' : 'Confirm Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password_confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  {...register('password_confirm')}
                  className={errors.password_confirm ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password_confirm && (
                <p className="text-sm text-red-500">{String(errors.password_confirm.message || errors.password_confirm)}</p>
              )}
            </div>
          )}

          {/* Forgot Password Link - Login only */}
          {mode === 'login' && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0"
                onClick={() => onModeChange?.('reset')}
              >
                Forgot password?
              </Button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Signing in...' :
                 mode === 'signup' ? 'Creating account...' :
                 mode === 'reset' ? 'Sending reset link...' :
                 'Resetting password...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' :
              mode === 'signup' ? 'Create Account' :
              mode === 'reset' ? 'Send Reset Link' :
              'Reset Password'
            )}
          </Button>

          {/* Mode Switch Links */}
          <div className="text-center text-sm">
            {mode === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => onModeChange?.('signup')}
                >
                  Sign up
                </Button>
              </>
            ) : mode === 'signup' ? (
              <>Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => onModeChange?.('login')}
                >
                  Sign in
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() => onModeChange?.('login')}
              >
                Back to Sign In
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}