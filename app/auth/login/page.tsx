'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthForm } from '@/components/auth/forms/auth-form'
import { useAuth } from '@/components/auth/contexts/auth-context'
import { toast } from 'sonner'

type AuthMode = 'login' | 'signup' | 'reset' | 'reset-confirm'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>('login')

  const getRedirectPath = useCallback(() => {
    const redirect = searchParams.get('redirect')
    return redirect ? decodeURIComponent(redirect) : '/dashboard'
  }, [searchParams])

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('✅ You are already logged in!', { duration: 2000 })
      const redirectPath = getRedirectPath()
      router.push(redirectPath)
    }
  }, [isAuthenticated, router, getRedirectPath])

  const handleSuccess = () => {
    const redirectPath = getRedirectPath()
    router.push(redirectPath)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthForm
          mode={mode}
          onSuccess={handleSuccess}
          onModeChange={setMode}
        />
      </div>
    </div>
  )
}