'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'

export interface FormActionsProps {
  onCancel?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  isDisabled?: boolean
  isValid?: boolean
  submitButtonText?: string
  cancelButtonText?: string
  buttonSize?: 'sm' | 'default' | 'lg'
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  showCancel?: boolean
  showSeparator?: boolean
  className?: string
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  isDisabled = false,
  isValid = true,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  buttonSize = 'default',
  buttonVariant = 'default',
  showCancel = true,
  showSeparator = true,
  className,
}) => {
  const isMobile = useIsMobile()

  return (
    <>
      {showSeparator && <Separator />}
      <div
        className={`flex items-center gap-3 ${
          isMobile ? 'flex-col' : 'justify-end'
        } ${className || ''}`}
      >
        {showCancel && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDisabled}
            size={buttonSize}
            className={isMobile ? 'w-full' : ''}
          >
            {cancelButtonText}
          </Button>
        )}

        <Button
          type="submit"
          disabled={isDisabled || isSubmitting}
          size={buttonSize}
          variant={buttonVariant}
          className={isMobile ? 'w-full' : ''}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </>
  )
}

export default FormActions
