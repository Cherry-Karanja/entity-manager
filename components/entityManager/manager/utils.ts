import React, { useState, useEffect, useRef, useCallback } from 'react'
import { EntityField } from './types'
import { FormField, ValidationRule } from '../EntityForm/types'

// ===== TYPE DEFINITIONS =====

/**
 * Result of field transformation
 */
export interface FieldTransformationResult {
  readonly success: boolean
  readonly field: FormField
  readonly errors?: string[]
}

/**
 * Options for field transformation
 */
export interface FieldTransformationOptions {
  readonly includeValidation?: boolean
  readonly includeRelationships?: boolean
  readonly includeAdvanced?: boolean
  readonly mode?: 'create' | 'edit' | 'view'
}

// ===== PERFORMANCE UTILITIES =====

/**
 * Debounce hook for performance optimization
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook for performance optimization
 */
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastRan = useRef<number>(Date.now())

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args)
        lastRan.current = Date.now()
      }
    }) as T,
    [callback, delay]
  )
}

// ===== SECURITY UTILITIES =====

/**
 * File type signatures for validation
 */
export const FILE_SIGNATURES = {
  // Images
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50]],
  'image/svg+xml': [[0x3C, 0x73, 0x76, 0x67]], // <svg
  // Documents
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'application/msword': [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]], // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]], // DOCX (ZIP)
  'application/vnd.ms-excel': [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]], // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0x50, 0x4B, 0x03, 0x04]], // XLSX (ZIP)
  // Videos
  'video/mp4': [[0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]], // MP4
  'video/avi': [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x41, 0x56, 0x49, 0x20]], // AVI
  'video/quicktime': [[0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]], // MOV
} as const

/**
 * Validate file content by checking magic bytes
 */
export const validateFileContent = async (file: File): Promise<boolean> => {
  const signatures = FILE_SIGNATURES[file.type as keyof typeof FILE_SIGNATURES]
  if (!signatures) return false

  const buffer = await file.slice(0, 12).arrayBuffer()
  const bytes = new Uint8Array(buffer)

  return signatures.some(signature => {
    return signature.every((byte, index) => {
      if (signature[index] === null) return true // Skip null bytes (wildcards)
      return bytes[index] === signature[index]
    })
  })
}

// ===== FIELD TRANSFORMATION UTILITIES =====

/**
 * Transform a single EntityField to FormFieldConfig
 */
export const transformEntityFieldToFormField = <TEntity, TFormData extends Record<string, unknown>>(
  field: EntityField<TEntity, TFormData>,
  options: FieldTransformationOptions = {}
): FieldTransformationResult => {
  const errors: string[] = []

  try {
    // Map entity field types to form field types
    let formType: FormField['type'] = 'text'
    switch (field.type) {
      case 'string':
        formType = field.fieldType === 'textarea' ? 'textarea' : 'text'
        break
      case 'email':
        formType = 'email'
        break
      case 'password':
        formType = 'password'
        break
      case 'number':
      case 'integer32':
      case 'integer64':
      case 'float':
      case 'double':
      case 'decimal':
        formType = 'number'
        break
      case 'boolean':
        formType = field.fieldType === 'switch' ? 'switch' : 'checkbox'
        break
      case 'date':
        formType = 'date'
        break
      case 'time':
        formType = 'time'
        break
      case 'select':
        formType = field.multiple ? 'multiselect' : 'select'
        break
      case 'textarea':
        formType = 'textarea'
        break
      case 'file':
        formType = 'file'
        break
      case 'url':
        formType = 'url'
        break
      default:
        formType = 'text'
    }

    const baseField: FormField = {
      name: field.key,
      label: field.label,
      type: formType,
      required: field.required,
      disabled: field.disabled || (field.readOnly && options.mode === 'edit'),
      placeholder: field.placeholder,
      description: field.description || field.helperText,
      validation: options.includeValidation && field.validation ? (() => {
        const rules: ValidationRule[] = []
        if (field.validation.min !== undefined) {
          rules.push({ type: 'min', value: field.validation.min, message: `Minimum value is ${field.validation.min}` })
        }
        if (field.validation.max !== undefined) {
          rules.push({ type: 'max', value: field.validation.max, message: `Maximum value is ${field.validation.max}` })
        }
        if (field.validation.minLength !== undefined) {
          rules.push({ type: 'minLength', value: field.validation.minLength, message: `Minimum length is ${field.validation.minLength}` })
        }
        if (field.validation.maxLength !== undefined) {
          rules.push({ type: 'maxLength', value: field.validation.maxLength, message: `Maximum length is ${field.validation.maxLength}` })
        }
        if (field.validation.pattern) {
          rules.push({ type: 'pattern', value: field.validation.pattern.toString(), message: 'Invalid format' })
        }
        if (field.validation.customValidate) {
          rules.push({ type: 'custom', validator: field.validation.customValidate, message: 'Validation failed' })
        }
        return rules.length > 0 ? rules : undefined
      })() : undefined,
      options: field.options?.map(opt => ({
        value: opt.value,
        label: opt.label
      })),
      multiple: field.multiple,
      min: field.validation?.min,
      max: field.validation?.max,
      minLength: field.validation?.minLength,
      maxLength: field.validation?.maxLength
    }

    return {
      success: true,
      field: baseField,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    return {
      success: false,
      field: {} as FormField,
      errors: [`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    }
  }
}

/**
 * Transform EntityField[] to FormFieldConfig[] for form compatibility
 */
export const transformEntityFieldsToFormFields = <TEntity, TFormData extends Record<string, unknown>>(
  fields: EntityField<TEntity, TFormData>[],
  options: FieldTransformationOptions = {}
): FormField[] => {
  // Filter out readonly fields for create mode (completely hide them)
  // For edit mode, keep them but mark as disabled
  const filteredFields = options.mode === 'create' 
    ? fields.filter(field => !field.readOnly)
    : fields

  return filteredFields.map(field => {
    const result = transformEntityFieldToFormField(field, options)
    if (!result.success) {
      console.warn(`Failed to transform field ${field.key}:`, result.errors)
      // Return a basic field configuration as fallback
      return {
        name: field.key,
        label: field.label,
        type: field.type as FormField['type'],
        required: field.required,
        disabled: field.disabled || (field.readOnly && options.mode === 'edit')
      }
    }
    return result.field
  })
}

// ===== DATA UTILITIES =====

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * Safely get nested property value
 */
export const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' && key in current
      ? (current as Record<string, unknown>)[key]
      : undefined
  }, obj as unknown)
}

/**
 * Set nested property value
 */
export const setNestedValue = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return

  const target = keys.reduce((current, key) => {
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}
    }
    return current[key] as Record<string, unknown>
  }, obj)
  target[lastKey] = value
}

// ===== VALIDATION UTILITIES =====

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ===== REACT UTILITIES =====

/**
 * Conditionally apply CSS classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}