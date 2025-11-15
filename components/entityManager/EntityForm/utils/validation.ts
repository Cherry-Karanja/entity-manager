import { FormField, FieldValidation } from '../types'
import { ValidationRule } from '../../core/types'

export const validateField = (
  value: unknown,
  field: FormField,
  schemaRules?: ValidationRule[]
): string[] => {
  const errors: string[] = []
  const rules = schemaRules || field.validation || []

  // Required validation
  if (field.required) {
    if (value === null || value === undefined || value === '') {
      // Check if there's a custom required message in schema rules
      const requiredRule = rules.find(rule => rule.type === 'required')
      const message = requiredRule?.message || `${field.label || field.name} is required`
      errors.push(message)
      return errors // Don't continue with other validations if required fails
    }
  }

  // Skip other validations if value is empty and field is not required
  if (value === null || value === undefined || value === '') {
    return errors
  }

  const stringValue = String(value)
  const numericValue = field.type === 'number' ? Number(value) : value

  // Apply validation rules
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        // Already handled above
        break

      case 'min':
        if (typeof numericValue === 'number' && typeof rule.value === 'number' && !isNaN(numericValue)) {
          if (numericValue < rule.value) {
            errors.push(rule.message || `${field.label || field.name} must be at least ${rule.value}`)
          }
        }
        break

      case 'max':
        if (typeof numericValue === 'number' && typeof rule.value === 'number' && !isNaN(numericValue)) {
          if (numericValue > rule.value) {
            errors.push(rule.message || `${field.label || field.name} must be at most ${rule.value}`)
          }
        }
        break

      case 'minLength':
        if (typeof rule.value === 'number' && stringValue.length < rule.value) {
          errors.push(rule.message || `${field.label || field.name} must be at least ${rule.value} characters`)
        }
        break

      case 'maxLength':
        if (typeof rule.value === 'number' && stringValue.length > rule.value) {
          errors.push(rule.message || `${field.label || field.name} must be at most ${rule.value} characters`)
        }
        break

      case 'pattern':
        if (typeof rule.value === 'string' || rule.value instanceof RegExp) {
          const regex = rule.value instanceof RegExp ? rule.value : new RegExp(rule.value)
          if (!regex.test(stringValue)) {
            errors.push(rule.message || `${field.label || field.name} format is invalid`)
          }
        }
        break

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(stringValue)) {
          errors.push(rule.message || `${field.label || field.name} must be a valid email address`)
        }
        break

      case 'url':
        try {
          new URL(stringValue)
        } catch {
          errors.push(rule.message || `${field.label || field.name} must be a valid URL`)
        }
        break

      case 'custom':
        if ('validator' in rule && rule.validator) {
          const result = (rule as any).validator(value, {})
          if (result === false) {
            errors.push(rule.message || `${field.label || field.name} is invalid`)
          } else if (typeof result === 'string') {
            errors.push(result)
          }
        }
        break
    }
  }

  return errors
}

export const validateForm = (
  data: Record<string, unknown>,
  fields: FormField[],
  schema?: Record<string, ValidationRule[]>
): Record<string, string> => {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const fieldErrors = validateField(data[field.name], field, schema?.[field.name])
    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors[0] // Only show first error per field
    }
  }

  return errors
}

export const isFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0
}