import React from "react"

// ===== TYPE DEFINITIONS =====

export interface EntityFormConfig {
  // Form fields configuration
  fields: FormField[]

  // Form behavior
  mode?: 'create' | 'edit' | 'view'
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: number

  // Data handling
  initialData?: Record<string, unknown>
  dataTransformer?: (data: Record<string, unknown>) => Record<string, unknown>
  submitTransformer?: (data: Record<string, unknown>) => Record<string, unknown>

  // Validation
  validationSchema?: Record<string, ValidationRule[]>
  validateOnChange?: boolean
  validateOnBlur?: boolean

  // Submission
  onSubmit?: (data: Record<string, unknown>) => Promise<void> | void
  onCancel?: () => void
  submitButtonText?: string
  cancelButtonText?: string
  submitSuccessMessage?: string

  // Bulk import
  enableBulkImport?: boolean
  bulkImportFormats?: BulkImportFormat[]
  onBulkImport?: (data: Record<string, unknown>[]) => Promise<void> | void

  // UI configuration
  showProgress?: boolean
  showValidationErrors?: boolean
  autoFocus?: boolean
  disabled?: boolean

  // Permissions & hooks
  permissions?: {
    create?: boolean
    edit?: boolean
    delete?: boolean
    import?: boolean
  }
  hooks?: {
    onFormChange?: (data: Record<string, unknown>, field: string, value: unknown) => void
    onValidationError?: (errors: Record<string, string>) => void
    onSubmitStart?: (data: Record<string, unknown>) => void
    onSubmitSuccess?: (data: Record<string, unknown>) => void
    onSubmitError?: (error: unknown) => void
    onBulkImportStart?: (file: File) => void
    onBulkImportSuccess?: (data: Record<string, unknown>[]) => void
    onBulkImportError?: (error: unknown) => void
  }

  // Styling
  className?: string
  fieldSpacing?: 'sm' | 'md' | 'lg'
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link'
  buttonSize?: 'sm' | 'default' | 'lg'
}

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  placeholder?: string
  description?: string
  helpText?: string

  // Field-specific options
  options?: FieldOption[]
  multiple?: boolean
  min?: number
  max?: number
  step?: number
  pattern?: string
  minLength?: number
  maxLength?: number
  rows?: number
  cols?: number

  // Validation
  validation?: ValidationRule[]

  // UI customization
  width?: number | string
  className?: string
  icon?: React.ComponentType<{ className?: string }>
  prefix?: string
  suffix?: string

  // Advanced features
  dependsOn?: string[]
  condition?: (values: Record<string, unknown>) => boolean
  transform?: (value: unknown) => unknown
  format?: (value: unknown) => string
  parse?: (value: string) => unknown

  // Custom rendering
  render?: (props: FieldRenderProps) => React.ReactNode
  component?: React.ComponentType<FieldRenderProps>
}

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'switch'
  | 'slider'
  | 'color'
  | 'json'
  | 'custom'

export interface FieldOption {
  label: string
  value: unknown
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom'
  value?: unknown
  message?: string
  validator?: (value: unknown, data: Record<string, unknown>) => boolean | string
}

export interface FieldRenderProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
  error?: string
  touched?: boolean
  disabled?: boolean
  required?: boolean
}

export interface BulkImportFormat {
  type: 'csv' | 'json' | 'xml' | 'xlsx'
  label: string
  extension: string
  mimeType: string
  delimiter?: string
  hasHeaders?: boolean
  fieldMapping?: Record<string, string>
}

export interface EntityFormProps {
  config: EntityFormConfig
  data?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => Promise<void> | void
  onCancel?: () => void
  disabled?: boolean
  loading?: boolean
  validationErrors?: Record<string, string[]>
}

export interface FormState {
  data: Record<string, unknown>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  submitCount: number
}

export interface BulkImportState {
  isImporting: boolean
  progress: number
  totalRecords: number
  processedRecords: number
  errors: Array<{ row: number; field: string; message: string }>
}

// ===== DEFAULT CONFIGURATIONS =====

export const DEFAULT_FORM_CONFIG: Partial<EntityFormConfig> = {
  mode: 'create',
  layout: 'vertical',
  columns: 1,
  validateOnChange: true,
  validateOnBlur: true,
  showProgress: false,
  showValidationErrors: true,
  autoFocus: true,
  fieldSpacing: 'md',
  buttonVariant: 'default',
  buttonSize: 'default',
  submitButtonText: 'Submit',
  cancelButtonText: 'Cancel',
  permissions: {
    create: true,
    edit: true,
    delete: true,
    import: false,
  },
}

export const DEFAULT_BULK_IMPORT_FORMATS: BulkImportFormat[] = [
  {
    type: 'csv',
    label: 'CSV',
    extension: 'csv',
    mimeType: 'text/csv',
    delimiter: ',',
    hasHeaders: true,
  },
  {
    type: 'json',
    label: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
  },
  {
    type: 'xlsx',
    label: 'Excel',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    hasHeaders: true,
  },
]

// ===== UTILITY TYPES =====

export type FormMode = 'create' | 'edit' | 'view'
export type FormLayout = 'vertical' | 'horizontal' | 'grid'
export type FieldSpacing = 'sm' | 'md' | 'lg'