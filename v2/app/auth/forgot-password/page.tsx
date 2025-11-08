'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth/forms/auth-form'

type AuthMode = 'login' | 'signup' | 'reset' | 'reset-confirm'

export default function PasswordResetPage() {
  const [mode, setMode] = useState<AuthMode>('reset')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthForm
          mode={mode}
          onModeChange={setMode}
        />
      </div>
    </div>
  )
}