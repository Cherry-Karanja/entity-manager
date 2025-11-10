'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthForm } from '@/components/auth/forms/auth-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

type AuthMode = 'login' | 'signup' | 'reset' | 'reset-confirm'

function PasswordResetConfirmPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [mode, setMode] = useState<AuthMode>('reset-confirm')

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Invalid Reset Link</CardTitle>
          <CardDescription className="text-center">
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please request a new password reset link from the forgot password page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <AuthForm
        mode={mode}
        token={token}
        onModeChange={setMode}
      />
    </div>
  )
}

export default function PasswordResetConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PasswordResetConfirmPageContent />
      </Suspense>
    </div>
  )
}