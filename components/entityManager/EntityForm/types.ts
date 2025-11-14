import React from "react"
import { FormField as UnifiedFormField, EntityHooks } from '../types'

// ===== TYPE DEFINITIONS =====

export interface EntityFormConfig<TEntity = unknown> {
  // Form fields configuration (SINGLE SOURCE OF TRUTH - from unified types)
  fields: UnifiedFormField[]

  // Form behavior
  mode?: 'create' | 'edit' | 'view'
  layout?: FormLayout
  columns?: number

  // Data handling
  initialData?: Partial<TEntity>
  dataTransformer?: (data: Partial<TEntity>) => Partial<TEntity>
  submitTransformer?: (data: Partial<TEntity>) => Partial<TEntity>

  // Validation
  validationMode?: 'onBlur' | 'onChange' | 'onSubmit'
  validateOnChange?: boolean
  validateOnBlur?: boolean

  // Submission
  onSubmit?: (data: Partial<TEntity>) => Promise<void> | void
  onCancel?: () => void
  submitButtonText?: string
  cancelButtonText?: string
  submitSuccessMessage?: string

  // Bulk import
  enableBulkImport?: boolean
  bulkImportFormats?: BulkImportFormat[]
  onBulkImport?: (data: Partial<TEntity>[]) => Promise<void> | void

  // UI configuration
  showProgress?: boolean
  showValidationErrors?: boolean
  autoFocus?: boolean
  disabled?: boolean

  // Permissions & hooks (from EntityManagerConfig)
  permissions?: FormPermissions
  hooks?: EntityHooks<TEntity>

  // Styling
  className?: string
  fieldSpacing?: 'sm' | 'md' | 'lg'
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link'
  buttonSize?: 'sm' | 'default' | 'lg'
  
  // Advanced
  customComponents?: FormCustomComponents
}

// Legacy type alias for backwards compatibility during migration
export type FormField = UnifiedFormField

export interface FormPermissions {
  create?: boolean
  edit?: boolean
  delete?: boolean
  import?: boolean
}

export interface FormCustomComponents {
  field?: React.ComponentType<FieldRenderProps>
  submit?: React.ComponentType<FormButtonProps>
  cancel?: React.ComponentType<FormButtonProps>
  wrapper?: React.ComponentType<FormWrapperProps>
  bulkImport?: React.ComponentType<BulkImportProps>
}

export interface FieldRenderProps {
  field: UnifiedFormField
  value: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
  error?: string
  touched?: boolean
  disabled?: boolean
  required?: boolean
}

export interface FormButtonProps {
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  children?: React.ReactNode
}

export interface FormWrapperProps {
  children: React.ReactNode
  config: EntityFormConfig
}

export interface BulkImportProps {
  config: EntityFormConfig
  onImport: (data: unknown[]) => void | Promise<void>
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

export interface EntityFormProps<TEntity = unknown> {
  config: EntityFormConfig<TEntity>
  data?: Partial<TEntity>
  onSubmit?: (data: Partial<TEntity>) => Promise<void> | void
  onCancel?: () => void
  disabled?: boolean
  loading?: boolean
  validationErrors?: Record<string, string[]>
}

export interface FormState<TEntity = unknown> {
  data: Partial<TEntity>
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