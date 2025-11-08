import { EntityField } from '../components/entityManager/manager/types'
import { FieldErrors } from 'react-hook-form'
import { clsx } from 'clsx'

/**
 * Dynamic styling configuration for conditional styles
 */
export interface DynamicStyleConfig {
  condition: (factors: StylingFactors) => boolean
  styles: string
  baseStyles?: string
  fieldTypeStyles?: Record<string, string>
  validationStyles?: Record<string, string>
  permissionStyles?: {
    disabled?: string
    readonly?: string
  }
  relationshipStyles?: Record<string, string>
  dataStyles?: Record<string, string>
  interactionStyles?: Record<string, string>
  conditionalStyles?: Array<{
    condition: (factors: StylingFactors) => boolean
    styles: string
  }>
  customRules?: (factors: StylingFactors) => string | undefined
}

/**
 * Dynamic styling factors that can influence field appearance
 */
export interface StylingFactors {
  fieldType: string
  fieldValue?: unknown
  hasError: boolean
  isRequired: boolean
  isDisabled: boolean
  isReadOnly: boolean
  hasPermission: {
    create: boolean
    update: boolean
    read: boolean
    delete: boolean
  }
  relationshipType?: 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many'
  validationState: 'valid' | 'invalid' | 'warning' | 'pending'
  dataState: 'empty' | 'filled' | 'modified' | 'default'
  interactionState: 'idle' | 'hover' | 'focus' | 'active'
}

/**
 * Generate styling factors from field configuration and current state
 */
export function generateStylingFactors(
  field: EntityField,
  value: unknown,
  errors: FieldErrors,
  permissions?: {
    create?: boolean
    update?: boolean
    read?: boolean
    delete?: boolean
  },
  interactionState: 'idle' | 'hover' | 'focus' | 'active' = 'idle'
): StylingFactors {
  const hasError = !!errors[field.key]
  const isRequired = field.required || false
  const isDisabled = field.disabled || false
  const isReadOnly = field.readOnly || false

  // Determine validation state
  let validationState: 'valid' | 'invalid' | 'warning' | 'pending' = 'valid'
  if (hasError) {
    validationState = 'invalid'
  } else if (isRequired && !value) {
    validationState = 'warning'
  }

  // Determine data state
  let dataState: 'empty' | 'filled' | 'modified' | 'default' = 'default'
  if (!value || (Array.isArray(value) && value.length === 0)) {
    dataState = 'empty'
  } else {
    dataState = 'filled'
  }

  return {
    fieldType: field.type,
    fieldValue: value,
    hasError,
    isRequired,
    isDisabled,
    isReadOnly,
    hasPermission: {
      create: permissions?.create ?? true,
      update: permissions?.update ?? true,
      read: permissions?.read ?? true,
      delete: permissions?.delete ?? true
    },
    relationshipType: field.relationshipType,
    validationState,
    dataState,
    interactionState
  }
}

/**
 * Apply dynamic styling based on configuration and factors
 */
export function applyDynamicStyling(
  config: DynamicStyleConfig,
  factors: StylingFactors
): string {
  const styles: string[] = []

  // Base styles
  if (config.baseStyles) {
    styles.push(config.baseStyles)
  }

  // Field type styles
  if (config.fieldTypeStyles?.[factors.fieldType]) {
    styles.push(config.fieldTypeStyles[factors.fieldType])
  }

  // Validation styles
  if (config.validationStyles?.[factors.validationState]) {
    styles.push(config.validationStyles[factors.validationState])
  }

  // Permission styles
  if (factors.isDisabled && config.permissionStyles?.disabled) {
    styles.push(config.permissionStyles.disabled)
  }
  if (factors.isReadOnly && config.permissionStyles?.readonly) {
    styles.push(config.permissionStyles.readonly)
  }

  // Relationship styles
  if (factors.relationshipType && config.relationshipStyles?.[factors.relationshipType]) {
    styles.push(config.relationshipStyles[factors.relationshipType])
  }

  // Data styles
  if (config.dataStyles?.[factors.dataState]) {
    styles.push(config.dataStyles[factors.dataState])
  }

  // Interaction styles
  if (config.interactionStyles?.[factors.interactionState]) {
    styles.push(config.interactionStyles[factors.interactionState])
  }

  // Conditional styles
  if (config.conditionalStyles) {
    for (const conditional of config.conditionalStyles) {
      if (conditional.condition(factors)) {
        styles.push(conditional.styles)
      }
    }
  }

  // Custom rules
  if (config.customRules) {
    const customStyles = config.customRules(factors)
    if (customStyles) {
      styles.push(customStyles)
    }
  }

  return clsx(styles)
}

/**
 * Predefined styling configurations for common use cases
 */
export const predefinedStyles = {

  // Container styles for field wrappers
  container: {
    baseStyles: 'space-y-2',
    validationStyles: {
      valid: '',
      invalid: 'animate-pulse',
      warning: '',
      pending: ''
    },
    permissionStyles: {
      disabled: 'opacity-60',
      readonly: 'opacity-80'
    }
  },

  // Label styles
  label: {
    baseStyles: 'text-sm font-medium text-gray-700 flex items-center gap-1',
    validationStyles: {
      valid: '',
      invalid: 'text-red-700',
      warning: 'text-yellow-700',
      pending: ''
    },
    permissionStyles: {
      disabled: 'text-gray-500',
      readonly: 'text-gray-600'
    }
  },

  // Error message styles
  error: {
    baseStyles: 'text-sm text-red-600 mt-1 flex items-center gap-1',
    fieldTypeStyles: {
      relationship: 'text-pink-600',
      file: 'text-yellow-600'
    }
  },

  // Relationship specific styles
  relationship: {
    baseStyles: 'border rounded-lg p-4 bg-gray-50',
    relationshipStyles: {
      'one-to-one': 'border-blue-200 bg-blue-50',
      'many-to-one': 'border-green-200 bg-green-50',
      'one-to-many': 'border-purple-200 bg-purple-50',
      'many-to-many': 'border-orange-200 bg-orange-50'
    },
    validationStyles: {
      valid: 'border-green-300',
      invalid: 'border-red-300 bg-red-50',
      warning: 'border-yellow-300 bg-yellow-50',
      pending: 'border-blue-300 bg-blue-50'
    }
  }
}

/**
 * Utility function to create conditional styling rules
 */
export function createConditionalStyle(
  condition: (factors: StylingFactors) => boolean,
  styles: string
) {
  return { condition, styles }
}

/**
 * Common conditional styling rules
 */
export const commonConditionalRules = {
  // Highlight required empty fields
  requiredEmpty: createConditionalStyle(
    (factors) => factors.isRequired && factors.dataState === 'empty',
    'ring-2 ring-yellow-300 border-yellow-400'
  ),

  // Dim disabled relationship fields
  disabledRelationship: createConditionalStyle(
    (factors) => factors.isDisabled && factors.fieldType === 'relationship',
    'opacity-50 pointer-events-none'
  ),

  // Highlight modified fields
  modifiedField: createConditionalStyle(
    (factors) => factors.dataState === 'modified',
    'shadow-md ring-1 ring-blue-300'
  ),

  // Special styling for file fields with errors
  fileError: createConditionalStyle(
    (factors) => factors.fieldType === 'file' && factors.validationState === 'invalid',
    'border-red-500 bg-red-50 animate-bounce'
  ),

  // Permission-based styling for readonly fields
  readonlyPermission: createConditionalStyle(
    (factors) => factors.isReadOnly && !factors.hasPermission.update,
    'bg-gray-100 border-gray-200 cursor-not-allowed'
  )
}