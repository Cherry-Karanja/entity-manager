/**
 * Unified Entity Manager Core Types
 * 
 * This module provides a consolidated, standardized type system for the Entity Manager.
 * It replaces fragmented type definitions across multiple files with a single source of truth.
 * 
 * @module core/types
 */

import React from 'react'
import { UseFormReturn } from 'react-hook-form'

// ===== BASE TYPES =====

/**
 * Base entity interface that all entities must extend.
 * Provides the minimum required properties for entity management.
 */
export interface BaseEntity {
  /** Unique identifier for the entity */
  readonly id: string | number
  /** Additional properties can be added by extending entities */
  [key: string]: unknown
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  validationErrors?: ValidationErrors
}

/**
 * Validation errors structure
 */
export interface ValidationErrors {
  fieldErrors: Record<string, string[]>
  nonFieldErrors: string[]
}

// ===== FIELD CONFIGURATION =====

/**
 * Supported data types for entity fields
 */
export type FieldDataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'email'
  | 'password'
  | 'url'
  | 'uuid'
  | 'text'
  | 'richtext'
  | 'select'
  | 'multiselect'
  | 'file'
  | 'image'
  | 'video'
  | 'json'
  | 'array'
  | 'object'
  | 'geography'
  | 'custom'

/**
 * Supported field render types for different contexts
 */
export type FieldRenderType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'slider'
  | 'color'
  | 'richtext'
  | 'json'
  | 'custom'

/**
 * Relationship types for entity associations
 */
export type RelationshipType = 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many'

/**
 * Field option for select/radio/checkbox fields
 */
export interface FieldOption {
  readonly value: string | number
  readonly label: string
  readonly disabled?: boolean
  readonly description?: string
  readonly icon?: React.ComponentType<{ className?: string }>
}

/**
 * Validation rule configuration
 */
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom'
  value?: unknown
  message?: string
  validator?: (value: unknown, formValues?: Record<string, unknown>) => boolean | string
}

/**
 * Relationship configuration for foreign key fields
 */
export interface RelationshipConfig {
  /** The related entity name */
  entity: string
  /** Field to use as the value (usually 'id') */
  valueField?: string
  /** Field to display from related entity */
  displayField: string
  /** API endpoint to fetch related data */
  endpoint?: string
  /** Additional fields to load from related entity */
  additionalFields?: string[]
  /** Filter criteria for available options */
  filter?: Record<string, unknown>
  /** Sort order for options */
  sort?: { field: string; direction: 'asc' | 'desc' }
  /** Allow creating new related entities inline */
  allowCreate?: boolean
  /** Allow editing related entities inline */
  allowEdit?: boolean
  /** Search configuration */
  search?: {
    enabled?: boolean
    fields?: string[]
    minLength?: number
    debounceMs?: number
  }
}

/**
 * Unified field configuration that works across Form, List, and View contexts
 */
export interface UnifiedFieldConfig<TEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  // ===== CORE PROPERTIES =====
  
  /** Unique field identifier (matches entity property name) */
  key: string
  
  /** Human-readable label */
  label: string
  
  /** Data type of the field */
  type: FieldDataType
  
  /** Optional render type override for forms */
  renderType?: FieldRenderType
  
  // ===== VALIDATION =====
  
  /** Whether the field is required */
  required?: boolean
  
  /** Whether the field can be null */
  nullable?: boolean
  
  /** Minimum value/length */
  min?: number
  
  /** Maximum value/length */
  max?: number
  
  /** Minimum string length */
  minLength?: number
  
  /** Maximum string length */
  maxLength?: number
  
  /** Validation pattern (regex) */
  pattern?: RegExp
  
  /** Validation rules */
  validation?: ValidationRule[]
  
  /** Custom validation function */
  validate?: (value: unknown, formValues?: Partial<TFormData>) => boolean | string
  
  // ===== UI CONFIGURATION =====
  
  /** Field description/help text */
  description?: string
  
  /** Placeholder text */
  placeholder?: string
  
  /** Default value */
  defaultValue?: unknown
  
  /** Whether field is disabled */
  disabled?: boolean
  
  /** Whether field is read-only */
  readOnly?: boolean
  
  /** Whether field is hidden */
  hidden?: boolean
  
  /** Grid column span */
  gridSpan?: 'full' | 'half' | 'third' | 'quarter' | number
  
  /** CSS class name */
  className?: string
  
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
  
  // ===== OPTIONS (for select/radio/checkbox) =====
  
  /** Options for select/radio/checkbox fields */
  options?: FieldOption[]
  
  /** Whether select is searchable */
  searchable?: boolean
  
  /** Whether multiple selections allowed */
  multiple?: boolean
  
  /** Maximum number of selections */
  maxSelections?: number
  
  // ===== RELATIONSHIP CONFIGURATION =====
  
  /** Foreign key relationship configuration */
  relationship?: RelationshipConfig
  
  // ===== FILE UPLOAD CONFIGURATION =====
  
  /** Accepted file types */
  accept?: string
  
  /** Maximum file size in bytes */
  maxFileSize?: number
  
  /** Maximum number of files */
  maxFiles?: number
  
  /** Enable drag and drop */
  enableDragDrop?: boolean
  
  /** Show file preview */
  showPreview?: boolean
  
  /** Upload endpoint URL */
  uploadUrl?: string
  
  // ===== CONDITIONAL DISPLAY =====
  
  /** Condition function to determine if field should be shown */
  condition?: (formValues: Partial<TFormData>) => boolean
  
  /** Fields this field depends on */
  dependsOn?: string[]
  
  // ===== DATA TRANSFORMATION =====
  
  /** Transform input value before saving */
  transformInput?: (value: unknown) => unknown
  
  /** Transform output value for display */
  transformOutput?: (value: unknown) => unknown
  
  /** Format value for display */
  format?: (value: unknown, entity?: TEntity) => React.ReactNode
  
  /** Parse string value to typed value */
  parse?: (value: string) => unknown
  
  // ===== LIST CONFIGURATION =====
  
  /** Whether column is sortable in lists */
  sortable?: boolean
  
  /** Whether column is filterable in lists */
  filterable?: boolean
  
  /** Whether column is searchable in lists */
  searchableInList?: boolean
  
  /** Column width in list view */
  width?: string | number
  
  /** Minimum column width */
  minWidth?: string | number
  
  /** Maximum column width */
  maxWidth?: string | number
  
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  
  /** Column priority (for responsive hiding) */
  priority?: number
  
  // ===== VIEW CONFIGURATION =====
  
  /** Whether value is copyable in view mode */
  copyable?: boolean
  
  /** Whether this is sensitive data (masked display) */
  sensitive?: boolean
  
  /** Badge display in view mode */
  badge?: boolean
  
  /** Link configuration in view mode */
  link?: {
    href: string | ((entity: TEntity) => string)
    target?: '_blank' | '_self'
  }
  
  // ===== CUSTOM RENDERING =====
  
  /** Custom cell renderer for list views */
  renderCell?: (value: unknown, entity: TEntity, index: number) => React.ReactNode
  
  /** Custom form field renderer */
  renderForm?: (props: {
    field: UnifiedFieldConfig<TEntity, TFormData>
    value: unknown
    onChange: (value: unknown) => void
    error?: string
    form: UseFormReturn<TFormData>
  }) => React.ReactNode
  
  /** Custom view renderer */
  renderView?: (value: unknown, entity: TEntity) => React.ReactNode
  
  // ===== EXPORT CONFIGURATION =====
  
  /** Whether field should be included in exports */
  exportable?: boolean
  
  /** Custom label for export headers */
  exportLabel?: string
  
  /** Transform function for export values */
  exportTransform?: (value: unknown) => unknown
}

// ===== ACTION CONFIGURATION =====

/**
 * Action types
 */
export type ActionType = 
  | 'immediate'
  | 'confirm'
  | 'form'
  | 'modal'
  | 'drawer'
  | 'navigation'

/**
 * Action context (where the action can be used)
 */
export type ActionContext = 'item' | 'bulk' | 'toolbar' | 'view'

/**
 * Unified action configuration
 */
export interface UnifiedActionConfig<TEntity = BaseEntity> {
  /** Unique action identifier */
  id: string
  
  /** Action label */
  label: string
  
  /** Action description */
  description?: string
  
  /** Action icon */
  icon?: React.ComponentType<{ className?: string }>
  
  /** Action type */
  type: ActionType
  
  /** Action context */
  context: ActionContext[]
  
  /** Visual variant */
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'ghost' | 'link'
  
  /** Action size */
  size?: 'sm' | 'default' | 'lg'
  
  /** Whether action is destructive/dangerous */
  danger?: boolean
  
  /** Whether action is disabled */
  disabled?: boolean
  
  /** Whether action is hidden */
  hidden?: boolean
  
  /** Permission required to see/use this action */
  permission?: string
  
  /** Condition to show/enable action */
  condition?: (entity: TEntity | TEntity[], context?: unknown) => boolean
  
  /** Execute handler */
  onExecute?: (entity: TEntity | TEntity[], context?: unknown) => void | Promise<void>
  
  /** Navigation URL */
  href?: string | ((entity: TEntity) => string)
  
  /** Link target */
  target?: '_blank' | '_self' | '_parent' | '_top'
  
  /** Confirmation configuration */
  confirm?: {
    title: string | ((entity: TEntity | TEntity[]) => string)
    content: string | React.ReactNode | ((entity: TEntity | TEntity[]) => string | React.ReactNode)
    okText?: string
    cancelText?: string
    okType?: 'primary' | 'danger'
  }
  
  /** Form configuration for form actions */
  form?: {
    title: string | ((entity: TEntity) => string)
    fields: UnifiedFieldConfig<TEntity>[]
    initialValues?: (entity: TEntity) => Record<string, unknown>
    onSubmit: (values: Record<string, unknown>, entity: TEntity) => Promise<void>
  }
  
  /** Modal configuration */
  modal?: {
    title: string | ((entity: TEntity) => string)
    content: React.ComponentType<{ entity: TEntity; onClose: () => void }>
    width?: string | number
  }
  
  /** Drawer configuration */
  drawer?: {
    title: string | ((entity: TEntity) => string)
    content: React.ComponentType<{ entity: TEntity; onClose: () => void }>
    placement?: 'left' | 'right' | 'top' | 'bottom'
    width?: string | number
  }
  
  /** Bulk action configuration */
  bulk?: {
    minItems?: number
    maxItems?: number
    batchSize?: number
    parallel?: boolean
  }
  
  /** Keyboard shortcut */
  shortcut?: string
  
  /** Action group */
  group?: string
  
  /** Priority (for ordering) */
  priority?: number
  
  /** Show separator after this action */
  separator?: boolean
  
  /** CSS class name */
  className?: string
}

// ===== FILTER CONFIGURATION =====

/**
 * Django REST Framework lookup operators
 */
export type FilterOperator =
  | 'exact' | 'iexact'
  | 'contains' | 'icontains'
  | 'startswith' | 'istartswith'
  | 'endswith' | 'iendswith'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'range'
  | 'isnull'
  | 'date' | 'year' | 'month' | 'day'
  | 'regex' | 'iregex'

/**
 * Unified filter configuration
 */
export interface UnifiedFilterConfig {
  /** Filter identifier */
  id: string
  
  /** Filter label */
  label: string
  
  /** Filter type */
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean' | 'range'
  
  /** Field to filter on */
  field: string
  
  /** Filter operator */
  operator?: FilterOperator
  
  /** Available operators */
  operators?: FilterOperator[]
  
  /** Filter options (for select types) */
  options?: FieldOption[]
  
  /** Placeholder text */
  placeholder?: string
  
  /** Default value */
  defaultValue?: unknown
  
  /** Minimum value (for number/date) */
  min?: number
  
  /** Maximum value (for number/date) */
  max?: number
  
  /** Step value (for number) */
  step?: number
  
  /** Validation function */
  validate?: (value: unknown) => boolean | string
  
  /** Transform function */
  transform?: (value: unknown, operator?: FilterOperator) => unknown
  
  /** Help text */
  helpText?: string
  
  /** Icon */
  icon?: React.ComponentType<{ className?: string }>
  
  /** Whether filter is required */
  required?: boolean
  
  /** CSS class name */
  className?: string
}

// ===== PERMISSION CONFIGURATION =====

/**
 * Unified permission configuration
 */
export interface UnifiedPermissionConfig {
  /** Permission to create entities */
  create?: boolean
  
  /** Permission to view/read entities */
  view?: boolean
  
  /** Permission to update entities */
  update?: boolean
  
  /** Permission to delete entities */
  delete?: boolean
  
  /** Permission to export data */
  export?: boolean
  
  /** Permission to import data */
  import?: boolean
  
  /** Custom permissions */
  custom?: Record<string, boolean>
}

// ===== ENDPOINT CONFIGURATION =====

/**
 * Unified endpoint configuration
 */
export interface UnifiedEndpointConfig {
  /** List endpoint (GET) */
  list: string
  
  /** Create endpoint (POST) */
  create: string
  
  /** Update endpoint (PUT/PATCH) - {id} will be replaced */
  update: string
  
  /** Delete endpoint (DELETE) - {id} will be replaced */
  delete: string
  
  /** Bulk import endpoint (POST) */
  bulkImport?: string
  
  /** Custom endpoints */
  custom?: Record<string, string>
}

// ===== LAYOUT CONFIGURATION =====

/**
 * Field group for organizing fields in forms and views
 */
export interface FieldGroup {
  /** Group identifier */
  id: string
  
  /** Group title */
  title: string
  
  /** Group description */
  description?: string
  
  /** Fields in this group (field keys) */
  fields: string[]
  
  /** Layout mode */
  layout?: 'vertical' | 'horizontal' | 'grid'
  
  /** Number of columns (for grid layout) */
  columns?: number
  
  /** Whether group is collapsible */
  collapsible?: boolean
  
  /** Whether group is initially collapsed */
  collapsed?: boolean
  
  /** CSS class name */
  className?: string
}

/**
 * View mode
 */
export type ViewMode = 'table' | 'card' | 'list' | 'grid' | 'compact' | 'detail'

// ===== MAIN ENTITY CONFIGURATION =====

/**
 * Unified Entity Configuration
 * 
 * This is the single configuration object that defines everything about an entity.
 * It consolidates all the previously separate configuration files into one cohesive structure.
 */
export interface UnifiedEntityConfig<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  // ===== BASIC INFORMATION =====
  
  /** Entity name (singular) */
  name: string
  
  /** Entity name (plural) */
  namePlural: string
  
  /** Display name for UI */
  displayName: string
  
  /** Entity description */
  description?: string
  
  /** Entity icon */
  icon?: React.ComponentType<{ className?: string }>
  
  // ===== FIELD DEFINITIONS =====
  
  /** Unified field configurations */
  fields: UnifiedFieldConfig<TEntity, TFormData>[]
  
  // ===== API CONFIGURATION =====
  
  /** API endpoints */
  endpoints: UnifiedEndpointConfig
  
  /** API request timeout (ms) */
  requestTimeout?: number
  
  /** API retry configuration */
  retry?: {
    enabled?: boolean
    maxAttempts?: number
    delayMs?: number
  }
  
  // ===== PERMISSIONS =====
  
  /** Permission configuration */
  permissions?: UnifiedPermissionConfig
  
  // ===== LIST CONFIGURATION =====
  
  list?: {
    /** Default fields to show in list (field keys) */
    defaultFields?: string[]
    
    /** Searchable fields */
    searchableFields?: string[]
    
    /** Default sort configuration */
    defaultSort?: { field: string; direction: 'asc' | 'desc' }
    
    /** Page size */
    pageSize?: number
    
    /** Page size options */
    pageSizeOptions?: number[]
    
    /** Available filters */
    filters?: UnifiedFilterConfig[]
    
    /** Default view mode */
    defaultView?: ViewMode
    
    /** Available view modes */
    availableViews?: ViewMode[]
    
    /** Allow selection */
    selectable?: boolean
    
    /** Allow export */
    exportable?: boolean
    
    /** Export formats */
    exportFormats?: ('csv' | 'xlsx' | 'json' | 'pdf')[]
    
    /** Dense mode */
    dense?: boolean
    
    /** Show row numbers */
    showRowNumbers?: boolean
  }
  
  // ===== FORM CONFIGURATION =====
  
  form?: {
    /** Form layout */
    layout?: 'vertical' | 'horizontal' | 'grid'
    
    /** Number of columns (for grid layout) */
    columns?: number
    
    /** Field groups */
    fieldGroups?: FieldGroup[]
    
    /** Validate on change */
    validateOnChange?: boolean
    
    /** Validate on blur */
    validateOnBlur?: boolean
    
    /** Submit button text */
    submitLabel?: string
    
    /** Cancel button text */
    cancelLabel?: string
    
    /** Auto-focus first field */
    autoFocus?: boolean
    
    /** Show progress indicator */
    showProgress?: boolean
  }
  
  // ===== VIEW CONFIGURATION =====
  
  view?: {
    /** View mode */
    mode?: 'detail' | 'card' | 'summary'
    
    /** Field groups */
    fieldGroups?: FieldGroup[]
    
    /** Show metadata */
    showMetadata?: boolean
    
    /** Show actions in view */
    showActions?: boolean
    
    /** Compact mode */
    compact?: boolean
  }
  
  // ===== ACTIONS =====
  
  /** Unified actions (context determines where they appear) */
  actions?: UnifiedActionConfig<TEntity>[]
  
  // ===== BULK OPERATIONS =====
  
  bulkImport?: {
    /** Whether bulk import is enabled */
    enabled: boolean
    
    /** Template name */
    templateName?: string
    
    /** Sample data for template */
    sampleData?: Record<string, unknown>[]
    
    /** Allowed formats */
    formats?: ('csv' | 'xlsx' | 'json')[]
  }
  
  // ===== RELATIONSHIPS =====
  
  /** Related entities */
  relatedEntities?: {
    /** Relationship name */
    name: string
    
    /** Display name */
    displayName: string
    
    /** Relationship type */
    type: RelationshipType
    
    /** Foreign key field */
    foreignKey: string
    
    /** Entity configuration for related entity */
    config: UnifiedEntityConfig
    
    /** Show in detail view */
    showInDetail?: boolean
    
    /** Detail position */
    detailPosition?: 'tabs' | 'accordion' | 'inline'
  }[]
  
  // ===== HOOKS & CALLBACKS =====
  
  hooks?: {
    /** Before entity list load */
    beforeListLoad?: () => void | Promise<void>
    
    /** After entity list load */
    afterListLoad?: (entities: TEntity[]) => void
    
    /** Before entity create */
    beforeCreate?: (data: TFormData) => TFormData | Promise<TFormData>
    
    /** After entity create */
    afterCreate?: (entity: TEntity) => void
    
    /** Before entity update */
    beforeUpdate?: (id: string | number, data: Partial<TFormData>) => Partial<TFormData> | Promise<Partial<TFormData>>
    
    /** After entity update */
    afterUpdate?: (entity: TEntity) => void
    
    /** Before entity delete */
    beforeDelete?: (id: string | number) => boolean | Promise<boolean>
    
    /** After entity delete */
    afterDelete?: (id: string | number) => void
    
    /** On validation error */
    onValidationError?: (errors: ValidationErrors) => void
    
    /** On API error */
    onApiError?: (error: unknown) => void
  }
  
  // ===== CUSTOMIZATION =====
  
  /** Custom components */
  customComponents?: {
    /** Custom list component */
    list?: React.ComponentType<any>
    
    /** Custom form component */
    form?: React.ComponentType<any>
    
    /** Custom view component */
    view?: React.ComponentType<any>
  }
  
  /** CSS class name */
  className?: string
  
  /** Custom styles */
  style?: React.CSSProperties
}

// ===== UTILITY TYPES =====

/**
 * Extract entity type from config
 */
export type ExtractEntity<T> = T extends UnifiedEntityConfig<infer E, any> ? E : never

/**
 * Extract form data type from config
 */
export type ExtractFormData<T> = T extends UnifiedEntityConfig<any, infer F> ? F : never

/**
 * Make specific properties optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>
