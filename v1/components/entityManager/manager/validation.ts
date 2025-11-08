import { z } from "zod"

// ===== ZOD SCHEMAS FOR RUNTIME VALIDATION =====

// Base entity schema
export const BaseEntitySchema = z.object({
  id: z.union([z.string(), z.number()]),
}).catchall(z.unknown())

// Form field option schema
export const FormFieldOptionSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string(),
  disabled: z.boolean().optional(),
  description: z.string().optional(),
})

// Field validation schema
export const FieldValidationSchema = z.object({
  pattern: z.instanceof(RegExp).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  customValidate: z.function().optional(),
}).optional()

// Cascade configuration schema
export const CascadeConfigSchema = z.object({
  delete: z.enum(['cascade', 'set-null', 'restrict', 'no-action']).optional(),
  update: z.enum(['cascade', 'set-null', 'restrict', 'no-action']).optional(),
}).optional()

// Related query schema
export const RelatedQuerySchema = z.object({
  fields: z.array(z.string()).optional(),
  filter: z.record(z.unknown()).optional(),
  sort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  }).optional(),
  limit: z.number().optional(),
}).optional()

// Inverse relationship schema
export const InverseRelationshipSchema = z.object({
  field: z.string(),
  type: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
}).optional()

// Discriminator schema
export const DiscriminatorSchema = z.object({
  propertyName: z.string(),
  mapping: z.record(z.string()).optional(),
}).optional()

// Polymorphic option schema
export const PolymorphicOptionSchema = z.object({
  schema: z.any(),
  type: z.string(),
})

// Entity field schema - comprehensive schema matching EntityField interface
export const EntityFieldSchema: z.ZodType<any> = z.object({
  // Basic properties
  key: z.string(),
  label: z.string(),
  type: z.enum([
    'string', 'number', 'date', 'time', 'boolean', 'select', 'array', 'file', 'image', 'video',
    'geography', 'custom', 'textarea', 'email', 'password', 'url', 'uuid', 'richtext', 'object',
    'polymorphic', 'integer32', 'integer64', 'float', 'double', 'decimal', 'hostname'
  ]),
  fieldType: z.enum([
    'input', 'textarea', 'select', 'multiselect', 'date', 'time', 'radio', 'checkbox', 'switch',
    'file', 'image', 'video', 'geography', 'custom', 'richtext', 'object', 'polymorphic'
  ]).optional(),

  // Validation
  required: z.boolean().optional(),
  nullable: z.boolean().optional(),
  validationFn: z.function().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.instanceof(RegExp).optional(),

  // UI properties
  placeholder: z.string().optional(),
  description: z.string().optional(),
  example: z.any().optional(),
  helpText: z.string().optional(),
  helperText: z.string().optional(),
  gridSpan: z.enum(['full', 'half', 'third']).optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),

  // Options for select/radio fields
  options: z.array(FormFieldOptionSchema).optional(),
  searchable: z.boolean().optional(),
  multiple: z.boolean().optional(),
  allowCustomValue: z.boolean().optional(),
  maxSelections: z.number().optional(),

  // Relationship properties
  foreignKey: z.boolean().optional(),
  relatedEntity: z.string().optional(),
  endpoint: z.string().optional(),
  relatedField: z.string().optional(),
  displayField: z.string().optional(),
  allowCreateNew: z.boolean().optional(),
  allowEditRelated: z.boolean().optional(),
  relationshipType: z.enum(['one-to-one', 'many-to-one', 'one-to-many', 'many-to-many']).optional(),
  cascade: CascadeConfigSchema,
  loadingStrategy: z.enum(['lazy', 'eager', 'explicit']).optional(),
  preloadRelated: z.boolean().optional(),
  relatedQuery: RelatedQuerySchema,
  inverseRelationship: InverseRelationshipSchema,

  // Array-specific properties
  arrayType: z.string().optional(),
  minItems: z.number().optional(),
  maxItems: z.number().optional(),
  uniqueItems: z.boolean().optional(),
  itemSchema: z.any().optional(),

  // Object-specific properties
  nestedFields: z.lazy(() => z.array(EntityFieldSchema)).optional(),
  collapsible: z.boolean().optional(),

  // Polymorphic-specific properties
  polymorphicType: z.enum(['oneOf', 'anyOf', 'allOf']).optional(),
  polymorphicOptions: z.array(PolymorphicOptionSchema).optional(),
  discriminator: DiscriminatorSchema,

  // Additional properties
  additionalProperties: z.union([z.boolean(), z.string()]).optional(),

  // File upload properties
  accept: z.string().optional(),
  maxFileSize: z.number().optional(),
  maxFiles: z.number().optional(),
  allowMultiple: z.boolean().optional(),
  encoding: z.string().optional(),
  showPreview: z.boolean().optional(),
  uploadUrl: z.string().optional(),

  // Geography properties
  mapProvider: z.enum(['google', 'openstreetmap', 'mapbox']).optional(),
  defaultCenter: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  defaultZoom: z.number().optional(),
  enableGeocoding: z.boolean().optional(),
  allowManualEntry: z.boolean().optional(),

  // Conditional display
  condition: z.function().optional(),

  // Default value
  defaultValue: z.any().optional(),

  // Event handlers
  onChange: z.function().optional(),

  // Custom renderer
  customRenderer: z.function().optional(),

  // Export configuration
  exportable: z.boolean().optional(),
  exportLabel: z.string().optional(),
  exportTransform: z.function().optional(),

  // Advanced validation
  validation: FieldValidationSchema,

  // View-specific properties
  sensitive: z.boolean().optional(),
  copyable: z.boolean().optional(),
  viewType: z.enum(['text', 'email', 'phone', 'url', 'badge', 'avatar', 'list', 'boolean', 'number']).optional(),
  icon: z.any().optional(),
}).catchall(z.unknown())

// Entity config schema
export const EntityConfigSchema = z.object({
  name: z.string(),
  namePlural: z.string(),
  displayName: z.string(),
  fields: z.array(EntityFieldSchema),
  endpoints: z.object({
    list: z.string(),
    create: z.string(),
    update: z.string(),
    delete: z.string(),
    bulkImport: z.string().optional(),
  }),
  listConfig: z.object({
    columns: z.array(z.object({
      id: z.string(),
      header: z.union([z.string(), z.any()]), // React.ReactNode
      accessorKey: z.string().optional(),
      accessorFn: z.function().optional(),
      cell: z.function().optional(),
      sortable: z.boolean().optional(),
      filterable: z.boolean().optional(),
      width: z.union([z.string(), z.number()]).optional(),
      align: z.enum(['left', 'center', 'right']).optional(),
      className: z.string().optional(),
    })),
    searchableFields: z.array(z.string()).optional(),
    defaultSort: z.object({
      field: z.string(),
      direction: z.enum(['asc', 'desc']),
    }).optional(),
    pageSize: z.number().optional(),
    allowBatchActions: z.boolean().optional(),
    allowExport: z.boolean().optional(),
  }),
  formConfig: z.object({
    title: z.string().optional(),
    createTitle: z.string().optional(),
    editTitle: z.string().optional(),
    description: z.string().optional(),
    submitLabel: z.string().optional(),
    cancelLabel: z.string().optional(),
    maxWidth: z.string().optional(),
  }).optional(),
  permissions: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    export: z.boolean().optional(),
  }).optional(),
}).catchall(z.unknown())

// API Response schemas
export const PaginatedResponseSchema = z.object({
  results: z.array(z.record(z.string(), z.unknown())),
  count: z.number(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
})

export const SingleEntityResponseSchema = z.record(z.string(), z.unknown())

// ===== VALIDATION FUNCTIONS =====

/**
 * Result of validation operation
 */
export interface ValidationResult {
  readonly success: boolean
  readonly errors?: z.ZodError[]
  readonly data?: unknown
}

/**
 * Validate entity configuration
 */
export function validateEntityConfig(config: unknown): boolean {
  try {
    EntityConfigSchema.parse(config)
    return true
  } catch (error) {
    console.error('EntityConfig validation failed:', error)
    return false
  }
}

/**
 * Validate paginated response
 */
export function validatePaginatedResponse(data: unknown): boolean {
  try {
    PaginatedResponseSchema.parse(data)
    return true
  } catch (error) {
    console.error('PaginatedResponse validation failed:', error)
    return false
  }
}

/**
 * Validate single entity response
 */
export function validateSingleEntity(data: unknown): boolean {
  try {
    SingleEntityResponseSchema.parse(data)
    return true
  } catch (error) {
    console.error('SingleEntity validation failed:', error)
    return false
  }
}

/**
 * Validate entity field configuration
 */
export function validateEntityField(field: unknown): boolean {
  try {
    EntityFieldSchema.parse(field)
    return true
  } catch (error) {
    console.error('EntityField validation failed:', error)
    return false
  }
}

/**
 * Validate form field option
 */
export function validateFormFieldOption(option: unknown): boolean {
  try {
    FormFieldOptionSchema.parse(option)
    return true
  } catch (error) {
    console.error('FormFieldOption validation failed:', error)
    return false
  }
}

// ===== TYPE-SAFE VALIDATION WITH DETAILED ERRORS =====

/**
 * Validate entity config with detailed error information
 */
export function validateEntityConfigWithErrors(config: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityConfigSchema.safeParse(config)
}

/**
 * Validate paginated response with detailed error information
 */
export function validatePaginatedResponseWithErrors(data: unknown): z.SafeParseReturnType<unknown, unknown> {
  return PaginatedResponseSchema.safeParse(data)
}

/**
 * Validate single entity with detailed error information
 */
export function validateSingleEntityWithErrors(data: unknown): z.SafeParseReturnType<unknown, unknown> {
  return SingleEntityResponseSchema.safeParse(data)
}

/**
 * Validate entity field with detailed error information
 */
export function validateEntityFieldWithErrors(field: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityFieldSchema.safeParse(field)
}

/**
 * Validate form field option with detailed error information
 */
export function validateFormFieldOptionWithErrors(option: unknown): z.SafeParseReturnType<unknown, unknown> {
  return FormFieldOptionSchema.safeParse(option)
}

// ===== ADVANCED VALIDATION UTILITIES =====

/**
 * Validate an array of entity fields
 */
export function validateEntityFields(fields: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validFields: unknown[] = []

  fields.forEach((field, index) => {
    const result = EntityFieldSchema.safeParse(field)
    if (result.success) {
      validFields.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`EntityField validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validFields
  }
}

/**
 * Validate entity configuration with nested field validation
 */
export function validateEntityConfigWithFieldValidation(config: unknown): ValidationResult {
  const configResult = EntityConfigSchema.safeParse(config)

  if (!configResult.success) {
    return {
      success: false,
      errors: [configResult.error]
    }
  }

  const configData = configResult.data as { fields: unknown[] }
  const fieldValidation = validateEntityFields(configData.fields)

  return {
    success: fieldValidation.success,
    errors: fieldValidation.errors,
    data: {
      ...configData,
      fields: fieldValidation.data
    }
  }
}

/**
 * Create a validation schema from entity fields
 */
export function createValidationSchemaFromFields(fields: unknown[]): z.ZodType<any> {
  const schema: Record<string, z.ZodType<any>> = {}

  fields.forEach((field) => {
    const fieldResult = EntityFieldSchema.safeParse(field)
    if (fieldResult.success) {
      const fieldData = fieldResult.data as {
        key: string
        type: string
        required?: boolean
        validation?: { min?: number; max?: number; minLength?: number; maxLength?: number; pattern?: RegExp }
      }

      let fieldSchema: z.ZodType<any>

      // Create base schema based on type
      switch (fieldData.type) {
        case 'string':
        case 'textarea':
        case 'email':
        case 'password':
        case 'url':
        case 'uuid':
        case 'richtext':
        case 'hostname':
          fieldSchema = z.string()
          if (fieldData.validation?.minLength) {
            fieldSchema = (fieldSchema as z.ZodString).min(fieldData.validation.minLength)
          }
          if (fieldData.validation?.maxLength) {
            fieldSchema = (fieldSchema as z.ZodString).max(fieldData.validation.maxLength)
          }
          if (fieldData.validation?.pattern) {
            fieldSchema = (fieldSchema as z.ZodString).regex(fieldData.validation.pattern)
          }
          break
        case 'number':
        case 'integer32':
        case 'integer64':
        case 'float':
        case 'double':
        case 'decimal':
          fieldSchema = z.number()
          if (fieldData.validation?.min !== undefined) {
            fieldSchema = (fieldSchema as z.ZodNumber).min(fieldData.validation.min)
          }
          if (fieldData.validation?.max !== undefined) {
            fieldSchema = (fieldSchema as z.ZodNumber).max(fieldData.validation.max)
          }
          break
        case 'boolean':
          fieldSchema = z.boolean()
          break
        case 'date':
        case 'time':
          fieldSchema = z.string() // Dates are typically serialized as strings
          break
        case 'select':
        case 'array':
          fieldSchema = z.array(z.any())
          break
        default:
          fieldSchema = z.any()
      }

      // Make optional if not required
      if (!fieldData.required) {
        fieldSchema = fieldSchema.optional()
      }

      schema[fieldData.key] = fieldSchema
    }
  })

  return z.object(schema)
}