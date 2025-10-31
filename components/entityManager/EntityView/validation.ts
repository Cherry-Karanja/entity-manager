import { z } from "zod"

// ===== ZOD SCHEMAS FOR RUNTIME VALIDATION =====

// View field schema
export const ViewFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum([
    'text', 'number', 'date', 'datetime', 'boolean', 'currency', 'percentage',
    'email', 'phone', 'url', 'image', 'avatar', 'badge', 'tags', 'json',
    'markdown', 'html', 'custom'
  ]).optional(),
  value: z.unknown().optional(),
  format: z.function().optional(),
  condition: z.function().optional(),
  hidden: z.boolean().optional(),

  // Display options
  width: z.union([z.number(), z.string()]).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),

  // Advanced features
  prefix: z.any().optional(),
  suffix: z.any().optional(),
  icon: z.function().optional(),
  badge: z.boolean().optional(),
  link: z.object({
    href: z.union([z.string(), z.function()]),
    target: z.enum(['_blank', '_self']).optional(),
  }).optional(),

  // Custom rendering
  render: z.function().optional(),
  component: z.function().optional(),
}).catchall(z.unknown())

// View field group schema
export const ViewFieldGroupSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(ViewFieldSchema),
  collapsed: z.boolean().optional(),
  collapsible: z.boolean().optional(),
  layout: z.enum(['vertical', 'horizontal', 'grid']).optional(),
  columns: z.number().optional(),
  className: z.string().optional(),
})

// View action schema
export const ViewActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.function().optional(),
  variant: z.enum(['default', 'outline', 'ghost', 'link', 'destructive']).optional(),
  size: z.enum(['sm', 'default', 'lg']).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  condition: z.function().optional(),
  onClick: z.function().optional(),
  href: z.union([z.string(), z.function()]).optional(),
  target: z.enum(['_blank', '_self']).optional(),
  confirm: z.object({
    title: z.string(),
    description: z.string().optional(),
    confirmText: z.string().optional(),
    cancelText: z.string().optional(),
  }).optional(),
})

// Entity view config schema
export const EntityViewConfigSchema = z.object({
  // View mode and layout
  mode: z.enum(['card', 'list', 'table', 'detail', 'summary', 'timeline', 'gallery', 'custom']).optional(),
  layout: z.enum(['single', 'grid', 'masonry', 'list', 'tabs', 'accordion']).optional(),
  theme: z.enum(['default', 'minimal', 'card', 'bordered', 'flat']).optional(),

  // Data display configuration
  fields: z.array(ViewFieldSchema).optional(),
  fieldGroups: z.array(ViewFieldGroupSchema).optional(),
  data: z.unknown().optional(),
  dataFetcher: z.function().optional(),

  // Display options
  showHeader: z.boolean().optional(),
  showActions: z.boolean().optional(),
  showMetadata: z.boolean().optional(),
  showNavigation: z.boolean().optional(),
  compact: z.boolean().optional(),

  // View components
  customComponents: z.object({
    header: z.function().optional(),
    content: z.function().optional(),
    actions: z.function().optional(),
    metadata: z.function().optional(),
  }).optional(),

  // Data transformation
  dataTransformer: z.function().optional(),
  fieldMapper: z.function().optional(),

  // Navigation and actions
  actions: z.array(ViewActionSchema).optional(), // Legacy support
  entityActions: z.any().optional(), // EntityActionsConfig
  navigation: z.object({
    prev: z.function().optional(),
    next: z.function().optional(),
    canGoPrev: z.boolean().optional(),
    canGoNext: z.boolean().optional(),
  }).optional(),

  // Permissions & hooks
  permissions: z.object({
    view: z.boolean().optional(),
    edit: z.boolean().optional(),
    delete: z.boolean().optional(),
    navigate: z.boolean().optional(),
  }).optional(),
  hooks: z.object({
    onViewLoad: z.function().optional(),
    onViewChange: z.function().optional(),
    onActionClick: z.function().optional(),
    onNavigate: z.function().optional(),
  }).optional(),

  // Styling and customization
  className: z.string().optional(),
  style: z.any().optional(),
  fieldSpacing: z.enum(['sm', 'md', 'lg']).optional(),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
}).catchall(z.unknown())

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
 * Validate view field
 */
export function validateViewField(field: unknown): boolean {
  try {
    ViewFieldSchema.parse(field)
    return true
  } catch (error) {
    console.error('ViewField validation failed:', error)
    return false
  }
}

/**
 * Validate view field group
 */
export function validateViewFieldGroup(group: unknown): boolean {
  try {
    ViewFieldGroupSchema.parse(group)
    return true
  } catch (error) {
    console.error('ViewFieldGroup validation failed:', error)
    return false
  }
}

/**
 * Validate view action
 */
export function validateViewAction(action: unknown): boolean {
  try {
    ViewActionSchema.parse(action)
    return true
  } catch (error) {
    console.error('ViewAction validation failed:', error)
    return false
  }
}

/**
 * Validate entity view config
 */
export function validateEntityViewConfig(config: unknown): boolean {
  try {
    EntityViewConfigSchema.parse(config)
    return true
  } catch (error) {
    console.error('EntityViewConfig validation failed:', error)
    return false
  }
}

// ===== TYPE-SAFE VALIDATION WITH DETAILED ERRORS =====

/**
 * Validate view field with detailed error information
 */
export function validateViewFieldWithErrors(field: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ViewFieldSchema.safeParse(field)
}

/**
 * Validate view field group with detailed error information
 */
export function validateViewFieldGroupWithErrors(group: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ViewFieldGroupSchema.safeParse(group)
}

/**
 * Validate view action with detailed error information
 */
export function validateViewActionWithErrors(action: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ViewActionSchema.safeParse(action)
}

/**
 * Validate entity view config with detailed error information
 */
export function validateEntityViewConfigWithErrors(config: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityViewConfigSchema.safeParse(config)
}

// ===== ADVANCED VALIDATION UTILITIES =====

/**
 * Validate an array of view fields
 */
export function validateViewFields(fields: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validFields: unknown[] = []

  fields.forEach((field, index) => {
    const result = ViewFieldSchema.safeParse(field)
    if (result.success) {
      validFields.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`ViewField validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validFields
  }
}

/**
 * Validate an array of view field groups
 */
export function validateViewFieldGroups(groups: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validGroups: unknown[] = []

  groups.forEach((group, index) => {
    const result = ViewFieldGroupSchema.safeParse(group)
    if (result.success) {
      validGroups.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`ViewFieldGroup validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validGroups
  }
}

/**
 * Validate an array of view actions
 */
export function validateViewActions(actions: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validActions: unknown[] = []

  actions.forEach((action, index) => {
    const result = ViewActionSchema.safeParse(action)
    if (result.success) {
      validActions.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`ViewAction validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validActions
  }
}