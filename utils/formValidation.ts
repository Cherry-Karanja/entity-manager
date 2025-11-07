"use client"

import { UseFormReturn } from 'react-hook-form'
import { AxiosError } from 'axios'
import { extractValidationErrors as extractApiValidationErrors } from './errorHandling'

export interface ValidationErrors {
  fieldErrors: Record<string, string[]>
  nonFieldErrors: string[]
}

/**
 * Maps API validation errors to React Hook Form
 * @param error - Axios error from API call
 * @param form - React Hook Form instance
 */
export function mapApiErrorsToFormFields(
  error: AxiosError,
  form: UseFormReturn<any>
): void {
  const validationErrors = extractApiValidationErrors(error)

  if (!validationErrors) {
    // If not validation errors, set general error
    const detail = error.response?.data && typeof error.response.data === 'object' && 'detail' in error.response.data
      ? (error.response.data as any).detail
      : undefined
    form.setError('root', {
      type: 'server',
      message: detail || error.message || 'An error occurred'
    })
    return
  }

  // Clear existing errors
  form.clearErrors()

  // Set field-specific errors
  Object.entries(validationErrors.fieldErrors).forEach(([field, messages]) => {
    form.setError(field as any, {
      type: 'server',
      message: messages.join(', ')
    })
  })

  // Set non-field errors
  if (validationErrors.nonFieldErrors.length > 0) {
    form.setError('root', {
      type: 'server',
      message: validationErrors.nonFieldErrors.join(', ')
    })
  }
}

/**
 * Extracts validation errors from API error
 * @param error - Axios error from API call
 * @returns ValidationErrors or null if not validation errors
 */
export function extractValidationErrorsFromApi(
  error: AxiosError
): ValidationErrors | null {
  return extractApiValidationErrors(error)
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use extractValidationErrorsFromApi instead
 */
export function extractValidationErrors<TEntity>(
  result: { success: true; data: TEntity } | { success: false; validationErrors: ValidationErrors }
): ValidationErrors | null {
  return result.success ? null : result.validationErrors
}