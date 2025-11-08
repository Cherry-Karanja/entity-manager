// ===== IMPORTS =====
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { EntityListColumn, EntityListFilter } from '../EntityList/types'
import { EntityAction, EntityActionsConfig } from '../EntityActions/types'
import { EntityViewConfig } from '../EntityView/types'
import { EntityFormConfig, FormField } from '../EntityForm/types'

// ===== BASIC TYPE DEFINITIONS =====

/**
 * Basic column configuration for data tables - alias for EntityListColumn
 */
export type Column = EntityListColumn

/**
 * Filter configuration for data tables - alias for EntityListFilter
 */
export type FilterConfig = EntityListFilter

/**
 * List item data structure - alias for EntityListItem
 */
export type ListItemData = import('../EntityList/types').EntityListItem

/**
 * Custom action configuration - alias for EntityAction
 */
export type CustomActionConfig = EntityAction

/**
 * Custom action context configuration - alias for EntityActionsConfig
 */
export type CustomActionContextConfig = EntityActionsConfig

/**
 * Form field configuration - alias for FormField
 */
export type FormFieldConfig = FormField

/**
 * Form configuration - alias for EntityFormConfig
 */
export type FormConfig = EntityFormConfig

// ===== ENHANCED TYPES =====

// ===== TYPE DEFINITIONS =====

/**
 * Supported field data types
 */
export type FieldDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'time'
  | 'boolean'
  | 'select'
  | 'array'
  | 'file'
  | 'image'
  | 'video'
  | 'geography'
  | 'custom'
  | 'textarea'
  | 'email'
  | 'password'
  | 'url'
  | 'uuid'
  | 'richtext'
  | 'object'
  | 'polymorphic'
  | 'integer32'
  | 'integer64'
  | 'float'
  | 'double'
  | 'decimal'
  | 'hostname'

/**
 * Supported field render types for forms
 */
export type FieldRenderType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'time'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'image'
  | 'video'
  | 'geography'
  | 'custom'
  | 'richtext'
  | 'object'
  | 'polymorphic'

/**
 * Relationship types
 */
export type RelationshipType = 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many'

/**
 * Cascade operation types
 */
export type CascadeOperation = 'cascade' | 'set-null' | 'restrict' | 'no-action'

/**
 * Loading strategies for related data
 */
export type LoadingStrategy = 'lazy' | 'eager' | 'explicit'

/**
 * Polymorphic types
 */
export type PolymorphicType = 'oneOf' | 'anyOf' | 'allOf'

/**
 * Map providers
 */
export type MapProvider = 'google' | 'openstreetmap' | 'mapbox'

/**
 * View display types
 */
export type ViewDisplayType = 'text' | 'email' | 'phone' | 'url' | 'badge' | 'avatar' | 'list' | 'boolean' | 'number'

/**
 * Form field option structure
 */
export interface FormFieldOption {
  readonly value: string | number
  readonly label: string
  readonly disabled?: boolean
  readonly description?: string
}

/**
 * Map coordinates
 */
export interface MapCoordinates {
  readonly lat: number
  readonly lng: number
}

/**
 * Cascade configuration
 */
export interface CascadeConfig {
  readonly delete?: CascadeOperation
  readonly update?: CascadeOperation
}

/**
 * Related query configuration
 */
export interface RelatedQuery {
  readonly fields?: readonly string[]
  readonly filter?: Record<string, unknown>
  readonly sort?: { readonly field: string; readonly direction: 'asc' | 'desc' }
  readonly limit?: number
}

/**
 * Inverse relationship configuration
 */
export interface InverseRelationship {
  readonly field: string
  readonly type: 'one-to-one' | 'one-to-many' | 'many-to-many'
}

/**
 * Polymorphic option
 */
export interface PolymorphicOption {
  readonly schema: unknown
  readonly type: string
}

/**
 * Discriminator configuration
 */
export interface DiscriminatorConfig {
  readonly propertyName: string
  readonly mapping?: Record<string, string>
}

/**
 * Field validation configuration
 */
export interface FieldValidation {
  readonly pattern?: RegExp
  readonly min?: number
  readonly max?: number
  readonly minLength?: number
  readonly maxLength?: number
  readonly customValidate?: (value: unknown) => boolean | string
}

// ===== GENERIC UTILITY TYPES =====

/**
 * Utility type for making specific properties optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Utility type for making specific properties required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Utility type for extracting the value type from a union of objects with a discriminator
 */
export type DiscriminatedUnion<T, K extends keyof T> = T extends any ? { [P in K]: T[P] } & T : never

/**
 * Utility type for creating strict object types
 */
export type Strict<T> = T & { [K in Exclude<string, keyof T>]: never }

// ===== GENERIC TYPES =====

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
 * Configuration for related entities (parent-child relationships)
 */
export interface RelatedEntityConfig<TEntity extends BaseEntity = BaseEntity> {
  /** Name of the related entity (singular) */
  name: string
  /** Display name for the related entity */
  displayName: string
  /** Type of relationship */
  relationship: 'one-to-many' | 'many-to-many' | 'one-to-one'
  /** Foreign key field in the child entity */
  foreignKey: string
  /** Entity configuration for the related entity */
  config: EntityConfig<TEntity>
  /** Whether to show in detail view */
  showInDetail?: boolean
  /** Where to position in detail view */
  detailPosition?: 'tabs' | 'accordion' | 'inline'
  /** Allow creating related entities */
  allowCreate?: boolean
  /** Allow editing related entities */
  allowEdit?: boolean
  /** Allow deleting related entities */
  allowDelete?: boolean
  /** Custom endpoint pattern for related entities */
  endpoint?: string
  /** URL to dedicated page for this relationship */
  dedicatedPageUrl?: string
}

/**
 * Configuration for individual entity fields.
 * Defines validation, UI behavior, and data transformation for each property.
 *
 * @template TEntity - The entity type this field belongs to
 * @template TFormData - The form data type for this entity
 */
export interface EntityField<TEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  // Basic properties
  /** Unique key for the field */
  key: string
  /** Display label for the field */
  label: string
  /** Data type of the field */
  type: 'string' | 'number' | 'date' | 'time' | 'boolean' | 'select' | 'array' | 'file' | 'image' | 'video' | 'geography' | 'custom' | 'textarea' | 'email' | 'password' | 'url' | 'uuid' | 'richtext' | 'object' | 'polymorphic' | 'integer32' | 'integer64' | 'float' | 'double' | 'decimal' | 'hostname'
  /** Optional field type for form rendering */
  fieldType?: 'input' | 'textarea' | 'select' | 'multiselect' | 'date' | 'time' | 'radio' | 'checkbox' | 'switch' | 'file' | 'image' | 'video' | 'geography' | 'custom' | 'richtext' | 'object' | 'polymorphic'

  // Validation
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is nullable */
  nullable?: boolean
  /** Custom validation function */
  validationFn?: (value: unknown) => boolean | string
  /** Minimum value/length */
  min?: number
  /** Maximum value/length */
  max?: number
  /** Minimum length for strings */
  minLength?: number
  /** Maximum length for strings */
  maxLength?: number
  /** Pattern for validation */
  pattern?: RegExp

  // UI properties
  /** Placeholder text for input fields */
  placeholder?: string
  /** Help text or description */
  description?: string
  /** Example value */
  example?: unknown
  /** Tailwind CSS classes for help text */
  helpText?: string
  /** Grid layout span (full, half, third) */
  gridSpan?: 'full' | 'half' | 'third'
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field is read-only */
  readOnly?: boolean

  // Options for select/radio fields
  /** Available options for select fields */
  options?: FormFieldOption[]
  /** Whether the select is searchable */
  searchable?: boolean
  /** Whether multiple selections are allowed */
  multiple?: boolean
  /** Whether to allow custom values */
  allowCustomValue?: boolean
  /** Maximum number of selections allowed */
  maxSelections?: number

  // Relationship properties for foreign keys and associations
  /** Whether this field is a foreign key reference */
  foreignKey?: boolean
  /** The related entity name this field references */
  relatedEntity?: string
  /** API endpoint to fetch related data from */
  endpoint?: string
  /** The related field name (usually 'id') */
  relatedField?: string
  /** Field to display from the related entity (e.g., 'name', 'title') */
  displayField?: string
  /** Whether to allow creating new related entities inline */
  allowCreateNew?: boolean
  /** Whether to allow editing related entities inline */
  allowEditRelated?: boolean
  /** Relationship type */
  relationshipType?: 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many'
  /** Cascade operations configuration */
  cascade?: {
    /** Cascade delete operations */
    delete?: 'cascade' | 'set-null' | 'restrict' | 'no-action'
    /** Cascade update operations */
    update?: 'cascade' | 'set-null' | 'restrict' | 'no-action'
  }
  /** Loading strategy for related data */
  loadingStrategy?: 'lazy' | 'eager' | 'explicit'
  /** Whether to preload related data */
  preloadRelated?: boolean
  /** Custom query for loading related options */
  relatedQuery?: {
    /** Fields to select from related entity */
    fields?: string[]
    /** Filter criteria for related entities */
    filter?: Record<string, unknown>
    /** Sort order for related entities */
    sort?: { field: string; direction: 'asc' | 'desc' }
    /** Maximum number of related entities to load */
    limit?: number
  }
  /** Inverse relationship configuration */
  inverseRelationship?: {
    /** Name of the inverse field on the related entity */
    field: string
    /** Type of inverse relationship */
    type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  }

  // Array-specific properties
  /** Type of items in the array */
  arrayType?: string
  /** Minimum number of items */
  minItems?: number
  /** Maximum number of items */
  maxItems?: number
  /** Whether items must be unique */
  uniqueItems?: boolean
  /** Schema for array items */
  itemSchema?: any

  // Object-specific properties
  /** Nested fields for object types */
  nestedFields?: EntityField[]
  /** Whether the object can be collapsed */
  collapsible?: boolean

  // Polymorphic-specific properties
  /** Type of polymorphism (oneOf, anyOf, allOf) */
  polymorphicType?: 'oneOf' | 'anyOf' | 'allOf'
  /** Options for polymorphic fields */
  polymorphicOptions?: Array<{ schema: any; type: string }>
  /** Discriminator configuration */
  discriminator?: {
    propertyName: string
    mapping?: Record<string, string>
  }

  // Additional properties
  /** Whether additional properties are allowed */
  additionalProperties?: boolean | string

  // File upload properties
  /** File types accepted (e.g., '.pdf,.doc,.docx') */
  accept?: string
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Whether multiple files are allowed */
  allowMultiple?: boolean
  /** File encoding */
  encoding?: string
  /** Whether to show file previews */
  showPreview?: boolean
  /** Custom upload endpoint URL */
  uploadUrl?: string

  // Geography properties
  /** Map provider for geography fields */
  mapProvider?: 'google' | 'openstreetmap' | 'mapbox'
  /** Default map center coordinates */
  defaultCenter?: { lat: number; lng: number }
  /** Default map zoom level */
  defaultZoom?: number
  /** Whether geocoding is enabled */
  enableGeocoding?: boolean
  /** Whether manual coordinate entry is allowed */
  allowManualEntry?: boolean

  // Conditional display
  /** Function to determine if field should be shown */
  condition?: (formValues: Partial<TFormData>) => boolean

  // Default value
  /** Default value for the field */
  defaultValue?: unknown

  // Event handlers
  /** Custom onChange handler */
  onChange?: (value: unknown) => unknown

  // Custom renderer
  /** Custom render function for the field */
  customRenderer?: (field: EntityField<TEntity, TFormData>, form: UseFormReturn<TFormData>) => React.ReactNode

  // Export configuration
  /** Whether field should be included in exports */
  exportable?: boolean
  /** Custom label for export headers */
  exportLabel?: string
  /** Transform function for export values */
  exportTransform?: (value: unknown) => unknown

  /** Alternative help text property */
  helperText?: string
  /** Advanced validation configuration */
  validation?: {
    pattern?: RegExp
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    customValidate?: (value: unknown) => boolean | string
  }
  // View-specific properties
  /** Whether the field contains sensitive information */
  sensitive?: boolean
  /** Whether the field value can be copied */
  copyable?: boolean
  /** How to display the field in views */
  viewType?: 'text' | 'email' | 'phone' | 'url' | 'badge' | 'avatar' | 'list' | 'boolean' | 'number'
  /** Icon component for the field */
  icon?: React.ComponentType<{ className?: string }>
  // Custom render functions
  /** Custom cell renderer for list views */
  renderCell?: (value: unknown, record: TEntity) => React.ReactNode
  /** Custom form renderer */
  renderForm?: (props: Record<string, unknown>) => React.ReactNode
  /** Custom view renderer */
  renderView?: (value: unknown, record: TEntity) => React.ReactNode
  // Transform functions
  /** Transform input value before saving */
  transformInput?: (value: unknown) => unknown
  /** Transform output value for display */
  transformOutput?: (value: unknown) => unknown
}

/**
 * Main configuration interface for entity management.
 * Defines all aspects of how an entity type should be managed including fields,
 * API endpoints, list configuration, permissions, and custom actions.
 *
 * @template TEntity - The specific entity type being managed (must extend BaseEntity)
 * @template TFormData - The form data structure for create/edit operations
 */
export interface EntityConfig<TEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  /** Singular name of the entity (e.g., 'User', 'Exam') */
  name: string
  /** Plural name of the entity (e.g., 'Users', 'Exams') */
  namePlural: string
  /** Human-readable display name for UI */
  displayName: string
  /** Field definitions for the entity */
  fields: EntityField<TEntity, TFormData>[]
  /** Relationship definitions for the entity */
  relationships?: EntityRelationship[]
  /** API endpoint configuration */
  endpoints: {
    /** Endpoint for listing entities (GET) */
    list: string
    /** Endpoint for creating entities (POST) */
    create: string
    /** Endpoint for updating entities (PUT/PATCH) */
    update: string
    /** Endpoint for deleting entities (DELETE) */
    delete: string
    /** Optional endpoint for bulk import operations */
    bulkImport?: string
    /** Endpoints for relationship operations */
    relationships?: {
      /** Endpoint for loading related entities */
      loadRelated?: string
      /** Endpoint for creating relationships */
      createRelationship?: string
      /** Endpoint for deleting relationships */
      deleteRelationship?: string
      /** Endpoint for updating relationships */
      updateRelationship?: string
    }
    /** Nested resource endpoints for hierarchical data */
    nested?: Record<string, NestedResourceConfig>
  }
  /** Configuration for the list/table view */
  listConfig: {
    /** Column definitions for the data table */
    columns: EntityListColumn[]
    /** Fields that should be searchable */
    searchableFields?: string[]
    /** Default sort configuration */
    defaultSort?: { field: string; direction: 'asc' | 'desc' }
    /** Default page size for pagination */
    pageSize?: number
    /** Whether batch actions are allowed */
    allowBatchActions?: boolean
    /** Whether export functionality is enabled */
    allowExport?: boolean
    /** Filter configuration for the list */
    filters?: EntityListFilter[]
    /** Field selection configuration for sparse fieldsets */
    fields?: string | string[]
    fieldSelection?: {
      /** Whether field selection is enabled */
      enabled?: boolean
      /** Default fields to select when none specified */
      defaultFields?: string[]
      /** Available fields for selection */
      availableFields?: string[]
      /** Whether to show field selector in UI */
      showSelector?: boolean
    }
    /** Related object expansion configuration */
    expand?: string | string[]
    expandable?: boolean
    /** Data transformation configuration for list display */
    dataTransform?: {
      /** Field or function to get the title for each item */
      titleField: string | ((item: Record<string, unknown>) => string)
      /** Field or function to get the subtitle for each item */
      subtitleField?: string | ((item: Record<string, unknown>) => string | undefined)
      /** Field or function to get the status for each item */
      descriptionField?: string | ((item: Record<string, unknown>) => string | undefined)
      /** Field or function to get the status display for each item */
      statusField?: string | ((item: Record<string, unknown>) => string | undefined)
      /** Function to get custom actions for each item */
      getActions?: (item: Record<string, unknown>) => {
        view?: boolean
        edit?: boolean
        delete?: boolean
        custom?: Array<{
          label: string
          icon?: React.ReactNode
          onClick: (item: Record<string, unknown>) => void | { props: Record<string, unknown> }
          variant?: 'default' | 'destructive'
        }>
      }
      /** Fields or function to get metadata for each item */
      metadataFields?: string[] | ((item: Record<string, unknown>) => Record<string, unknown>)
    }
    /** Callback when an item is clicked */
    onItemClick?: (item: TEntity) => void | string
  }
  /** Configuration for create/edit forms */
  formConfig?: {
    /** Custom title for the form */
    title?: string
    /** Title specifically for create forms */
    createTitle?: string
    /** Title specifically for edit forms */
    editTitle?: string
    /** Description text for the form */
    description?: string
    /** Text for the submit button */
    submitLabel?: string
    /** Text for the cancel button */
    cancelLabel?: string
    /** Maximum width of the form container */
    maxWidth?: string
    /** Layout style for the form */
    layout?: 'stack' | 'grid' | 'flex'
    /** Number of columns for grid layout */
    columns?: number
    
  }
  /** Configuration for reusable form component */
  reusableFormConfig?: FormConfig
  /** Configuration for the entity view component */
  viewConfig?: EntityViewConfig
  /** Configuration for bulk import functionality */
  bulkImport?: {
    /** Whether bulk import is enabled */
    enabled: boolean
    /** Name of the import template */
    templateName?: string
    /** Sample data for the import template */
    sampleData?: Record<string, unknown>[]
    /** Whether to allow import of invalid records */
    allowInvalidImport?: boolean
    /** Whether to skip validation during import */
    skipValidationOnImport?: boolean
  }
  /** Permission configuration for different operations */
  permissions?: {
    /** Permission to create new entities */
    create?: boolean
    /** Permission to read/view entities */
    view?: boolean
    /** Permission to update existing entities */
    update?: boolean
    /** Permission to delete entities */
    delete?: boolean
    /** Permission to export data */
    export?: boolean
  }
  /** Custom actions configuration */
  customActions?: {
    /** Actions available for individual items */
    item?: CustomActionConfig[]
    /** Actions available for bulk operations */
    bulk?: CustomActionConfig[]
    /** Context configuration for action handling */
    context?: CustomActionContextConfig
  }
  /** Related entities configuration for hierarchical relationships */
  relatedEntities?: RelatedEntityConfig[]
  /** Breadcrumb configuration */
  breadcrumbs?: {
    /** Whether to show breadcrumbs */
    show: boolean
    /** Breadcrumb items */
    items: Array<{
      label: string
      href?: string
    }>
  }
  /** Common actions configuration */
  commonActions?: {
    /** Custom view action handler */
    view?: boolean | ((item: TEntity) => void)
    /** Custom edit action handler */
    edit?: boolean | ((item: TEntity) => void)
    /** Custom delete action handler */
    delete?: boolean | ((item: TEntity) => void)
    /** Custom duplicate action handler */
    duplicate?: boolean | ((item: TEntity) => Promise<void>)
    /** Custom archive action handler */
    archive?: boolean | ((item: TEntity) => Promise<void>)
    /** Custom export action handler */
    export?: boolean | ((item: TEntity) => void)
  }
  /** Chat configuration for real-time messaging */
  chat?: {
    /** Whether chat is enabled for this entity */
    enabled: boolean
    /** WebSocket URL for chat connections */
    websocketUrl: string
    /** Prefix for chat room names (e.g., 'entity_' for 'entity_user_123') */
    roomPrefix?: string
    /** Maximum number of messages to keep in memory */
    maxMessages?: number
    /** Whether to enable mock mode for development */
    mockEnabled?: boolean
    /** Mock messages for development */
    mockMessages?: any[]
    /** Delay between mock messages in milliseconds */
    mockDelay?: number
  }
}

/**
 * Props interface for the UnifiedEntityManager component.
 * Defines all configurable options for the entity management interface.
 *
 * @template TEntity - The specific entity type being managed
 * @template TFormData - The form data structure for create/edit operations
 */
export interface UnifiedEntityManagerProps<TEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  /** Configuration object defining all aspects of entity management */
  config: EntityConfig<TEntity, TFormData>
  /** Display variant for the list view */
  variant?: 'table' | 'card' | 'list' | 'grid' | 'compact'
  /** Initial mode when component mounts */
  initialMode?: 'list' | 'create' | 'edit' | 'view'
  /** Callback fired when the mode changes */
  onModeChange?: (mode: 'list' | 'create' | 'edit' | 'view', data?: TEntity) => void
  /** Additional CSS classes for the component */
  className?: string
  /** Filter configuration for the list view */
  filters?: EntityListFilter[]
  /** View-specific props */
  viewMode?: 'modal' | 'page' | 'inline'
  /** Whether the view functionality is enabled */
  enableView?: boolean
  /** Context data passed to custom actions */
  contextData?: Record<string, unknown>
}

// ===== RELATIONSHIP MANAGEMENT TYPES =====

/**
 * Configuration for entity relationships.
 * Defines how entities relate to each other and how relationships should be handled.
 */
export interface EntityRelationship {
  /** Unique identifier for the relationship */
  id: string
  /** Source entity name */
  sourceEntity: string
  /** Target entity name */
  targetEntity: string
  /** Type of relationship */
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'
  /** Field name on source entity */
  sourceField: string
  /** Field name on target entity */
  targetField: string
  /** Display field for relationship representation */
  displayField?: string
  /** Cascade operations */
  cascade?: {
    delete?: 'cascade' | 'set-null' | 'restrict' | 'no-action'
    update?: 'cascade' | 'set-null' | 'restrict' | 'no-action'
  }
  /** Loading strategy */
  loadingStrategy?: 'lazy' | 'eager' | 'explicit'
  /** Whether relationship is required */
  required?: boolean
  /** Custom relationship constraints */
  constraints?: {
    /** Minimum number of relationships */
    minItems?: number
    /** Maximum number of relationships */
    maxItems?: number
    /** Custom validation function */
    validate?: (sourceId: string | number, targetIds: (string | number)[]) => boolean | string
  }
}

/**
 * Configuration for relationship-based queries and data loading.
 */
export interface RelationshipQuery {
  /** Entity to query */
  entity: string
  /** Relationship to follow */
  relationship: string
  /** Fields to include from related entity */
  fields?: string[]
  /** Filter criteria */
  filter?: Record<string, unknown>
  /** Sort configuration */
  sort?: { field: string; direction: 'asc' | 'desc' }
  /** Pagination */
  pagination?: {
    page: number
    pageSize: number
  }
  /** Whether to include nested relationships */
  includeNested?: boolean
  /** Maximum depth for nested relationships */
  maxDepth?: number
}

/**
 * Result of a relationship query.
 */
export interface RelationshipQueryResult {
  /** The main entity data */
  data: Record<string, unknown>
  /** Related entity data */
  related: Record<string, Record<string, unknown>[]>
  /** Metadata about the query */
  meta: {
    totalCount: number
    loadedCount: number
    hasMore: boolean
  }
}

/**
 * Configuration for relationship validation.
 */
export interface RelationshipValidation {
  /** Type of validation */
  type: 'required' | 'unique' | 'exists' | 'custom'
  /** Error message */
  message: string
  /** Custom validation function */
  validate?: (value: unknown, context: Record<string, unknown>) => boolean | string
}

/**
 * Enhanced foreign key configuration with advanced options.
 */
export interface ForeignKeyConfig {
  /** The referenced entity */
  entity: string
  /** The referenced field (usually 'id') */
  field: string
  /** Field to display from referenced entity */
  displayField: string
  /** Additional fields to load from referenced entity */
  additionalFields?: string[]
  /** Filter for available options */
  filter?: Record<string, unknown>
  /** Sort order for options */
  sort?: { field: string; direction: 'asc' | 'desc' }
  /** Whether to allow multiple selections */
  multiple?: boolean
  /** Minimum number of selections required */
  minSelections?: number
  /** Maximum number of selections allowed */
  maxSelections?: number
  /** Whether to allow creating new related entities */
  allowCreate?: boolean
  /** Whether to allow editing related entities */
  allowEdit?: boolean
  /** Custom option formatter */
  optionFormatter?: (item: Record<string, unknown>) => {
    value: string | number
    label: string
    description?: string
    disabled?: boolean
  }
  /** Search configuration */
  search?: {
    /** Fields to search in */
    fields: string[]
    /** Minimum characters required to trigger search */
    minLength: number
    /** Debounce delay in milliseconds */
    debounceMs: number
  }
}

// ===== IMPORTED TYPES =====

// Re-export types from other modules for convenience
// Note: Types are now defined inline above
// export type { Column, ListItemData, FilterConfig } from "../enhancedReusableList/types"
// export type { CustomActionConfig, CustomActionContextConfig } from "../enhancedEntityCustomActions/types"
// export type { EntityViewConfig } from "../reusableEntityView/types"
// export type { FormConfig, FormFieldConfig } from "../reusableEntityForm/types"

/**
 * Configuration for nested resource relationships
 */
export interface NestedResourceConfig {
  /** Endpoint pattern for the nested resource (e.g., '/api/properties/{property_id}/tenants/') */
  endpoint: string
  /** Field name in the child entity that references the parent */
  parentField: string
  /** Name of the relationship for URL building */
  relatedName: string
  /** Whether this nested resource is the primary relationship */
  primary?: boolean
  /** Custom permissions for nested operations */
  permissions?: {
    create?: boolean
    read?: boolean
    update?: boolean
    delete?: boolean
  }
}