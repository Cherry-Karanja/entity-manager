import React from 'react'

// Import component configs to use in EntityManagerConfig
import type { EntityListConfig } from '../EntityList/types'
import type { EntityFormConfig } from '../EntityForm/types'
import type { EntityViewConfig } from '../EntityView/types'
import type { EntityActionsConfig } from '../EntityActions/types'
import type { EntityExporterConfig, ExportFormat, ExportFormatType } from '../EntityExporter/types'

// ===== CORE ENTITY TYPES =====

export interface Entity {
  id: string | number
  [key: string]: unknown
}

// ===== FIELD DEFINITIONS (Single Source of Truth) =====

export interface FormField {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  validation?: FieldValidation
  defaultValue?: unknown
  placeholder?: string
  helpText?: string
  disabled?: boolean
  readOnly?: boolean
  hidden?: boolean
  condition?: (formData: unknown) => boolean
  options?: FieldOption[]
  grid?: { col?: number; row?: number }
  
  // Advanced
  dependsOn?: string[]
  transform?: (value: unknown) => unknown
  component?: React.ComponentType<{
    field: FormField
    value: unknown
    onChange: (value: unknown) => void
    onBlur: () => void
    error?: string
    touched?: boolean
    disabled?: boolean
    required?: boolean
  }>
  
  // Styling
  className?: string
  containerClassName?: string
}

export type FormFieldType =
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio'
  | 'date' | 'datetime' | 'time' | 'file' | 'image'
  | 'rich-text' | 'markdown' | 'json' | 'custom'

export interface FieldValidation {
  required?: boolean | string
  min?: number | string
  max?: number | string
  minLength?: number | string
  maxLength?: number | string
  pattern?: RegExp | string
  email?: boolean | string
  url?: boolean | string
  custom?: (value: unknown) => string | boolean
}

export interface FieldOption {
  value: string | number
  label: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

// ===== API CONFIGURATION (Centralized) =====

export interface EntityManagerConfig<TEntity = Entity> {
  // Entity identification
  entityName: string
  entityNamePlural?: string
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: EntityEndpoints
  
  // Component configurations
  list?: EntityListConfig<TEntity>
  form?: EntityFormConfig<TEntity>
  view?: EntityViewConfig<TEntity>
  actions?: EntityActionsConfig<TEntity>
  exporter?: EntityExporterConfig<TEntity>
  
  // Global settings
  permissions?: EntityPermissions
  features?: EntityFeatures
  hooks?: EntityHooks<TEntity>
  
  // Advanced
  className?: string
  theme?: 'light' | 'dark' | 'system'
}

export interface EntityEndpoints {
  list: string
  create: string
  read: string
  update: string
  delete: string
  export?: string
  import?: string
  bulk?: string
  [key: string]: string | undefined
}

export interface EntityPermissions {
  create?: boolean
  read?: boolean
  update?: boolean
  delete?: boolean
  export?: boolean
  import?: boolean
  bulk?: boolean
  [key: string]: boolean | undefined
}

export interface EntityFeatures {
  search?: boolean
  filter?: boolean
  sort?: boolean
  pagination?: boolean
  export?: boolean
  import?: boolean
  bulk?: boolean
  audit?: boolean
  versioning?: boolean
  [key: string]: boolean | undefined
}

export interface EntityHooks<TEntity = Entity> {
  // Lifecycle hooks
  beforeCreate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
  afterCreate?: (data: TEntity) => void | Promise<void>
  beforeUpdate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
  afterUpdate?: (data: TEntity) => void | Promise<void>
  beforeDelete?: (id: string | number) => boolean | Promise<boolean>
  afterDelete?: (id: string | number) => void | Promise<void>
  
  // Data hooks
  beforeFetch?: () => void | Promise<void>
  afterFetch?: (data: TEntity[]) => TEntity[] | Promise<TEntity[]>
  
  // Validation hooks
  validateCreate?: (data: Partial<TEntity>) => string | null | Promise<string | null>
  validateUpdate?: (data: Partial<TEntity>) => string | null | Promise<string | null>
}

// ===== COMMON UTILITIES =====

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

// ===== RE-EXPORT COMPONENT CONFIGS FOR EXTERNAL USE =====

export type {
  EntityListConfig,
  EntityFormConfig,
  EntityViewConfig,
  EntityActionsConfig,
  EntityExporterConfig,
  ExportFormat,
  ExportFormatType,
}
