'use client'

import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle } from 'lucide-react'

export interface FormMessagesProps {
  successMessage?: string | null
  errorMessage?: string | null
  showSuccess?: boolean
  showError?: boolean
  className?: string
}

export const FormMessages: React.FC<FormMessagesProps> = ({
  successMessage,
  errorMessage,
  showSuccess = false,
  showError = false,
  className,
}) => {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {showSuccess && successMessage && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {showError && errorMessage && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default FormMessages
