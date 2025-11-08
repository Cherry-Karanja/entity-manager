import { z } from "zod"

// ===== ZOD SCHEMAS FOR RUNTIME VALIDATION =====

// Base action schema
export const EntityActionSchema: z.ZodType<any> = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  icon: z.function().optional(),
  type: z.enum(['primary', 'default', 'dashed', 'link', 'text']),
  size: z.enum(['small', 'middle', 'large']).optional(),
  danger: z.boolean().optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  hidden: z.boolean().optional(),

  // Permissions & visibility
  permission: z.string().optional(),
  condition: z.function().optional(),
  visible: z.function().optional(),

  // Action behavior
  actionType: z.enum(['immediate', 'confirm', 'form', 'bulk', 'async', 'navigation', 'modal', 'drawer']),

  // Execution
  onExecute: z.function().optional(),

  // Navigation actions
  href: z.union([z.string(), z.function()]).optional(),
  target: z.enum(['_blank', '_self', '_parent', '_top']).optional(),
  router: z.enum(['next', 'react-router', 'window']).optional(),

  // Confirmation actions
  confirm: z.object({
    title: z.union([z.string(), z.function()]),
    content: z.union([z.string(), z.any(), z.function()]),
    okText: z.string().optional(),
    cancelText: z.string().optional(),
    okType: z.enum(['primary', 'danger']).optional(),
    centered: z.boolean().optional(),
  }).optional(),

  // Form actions
  form: z.object({
    title: z.union([z.string(), z.function()]),
    width: z.union([z.string(), z.number()]).optional(),
    fields: z.array(z.any()), // EntityActionFormField schema defined below
    initialValues: z.function().optional(),
    validation: z.record(z.function()).optional(),
    submitText: z.string().optional(),
  }).optional(),

  // Modal actions
  modal: z.object({
    title: z.union([z.string(), z.function()]),
    content: z.any(),
    width: z.union([z.string(), z.number()]).optional(),
    footer: z.union([z.any(), z.function()]).optional(),
  }).optional(),

  // Drawer actions
  drawer: z.object({
    title: z.union([z.string(), z.function()]),
    content: z.any(),
    width: z.union([z.string(), z.number()]).optional(),
    placement: z.enum(['left', 'right', 'top', 'bottom']).optional(),
  }).optional(),

  // Async actions
  async: z.object({
    loadingText: z.union([z.string(), z.function()]).optional(),
    successMessage: z.union([z.string(), z.function()]).optional(),
    errorMessage: z.union([z.string(), z.function()]).optional(),
    showProgress: z.boolean().optional(),
    timeout: z.number().optional(),
  }).optional(),

  // Bulk actions
  bulk: z.object({
    minItems: z.number().optional(),
    maxItems: z.number().optional(),
    confirmMessage: z.function().optional(),
    batchSize: z.number().optional(),
    parallel: z.boolean().optional(),
  }).optional(),

  // Keyboard shortcuts
  shortcut: z.string().optional(),

  // Grouping & ordering
  group: z.string().optional(),
  priority: z.number().optional(),
  separator: z.boolean().optional(),

  // Styling
  className: z.string().optional(),
  style: z.any().optional(),

  // Advanced features
  debounce: z.number().optional(),
  throttle: z.number().optional(),
  retry: z.object({
    attempts: z.number(),
    delay: z.number(),
    backoff: z.enum(['linear', 'exponential']),
  }).optional(),
}).catchall(z.unknown())

// Form field schema for action forms
export const EntityActionFormFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'date', 'time', 'boolean', 'select', 'multiselect', 'textarea', 'email', 'url', 'password', 'file', 'image', 'custom']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  options: z.array(z.object({
    value: z.union([z.string(), z.number()]),
    label: z.string(),
    disabled: z.boolean().optional(),
  })).optional(),
  validation: z.function().optional(),
  defaultValue: z.any().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
  dependencies: z.array(z.string()).optional(),
  customRenderer: z.function().optional(),
})

// Bulk action schema
export const EntityBulkActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.function().optional(),
  type: z.enum(['primary', 'default', 'dashed', 'link', 'text']),
  size: z.enum(['small', 'middle', 'large']).optional(),
  danger: z.boolean().optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  hidden: z.boolean().optional(),
  permission: z.string().optional(),
  actionType: z.enum(['immediate', 'confirm', 'form', 'bulk', 'async', 'navigation', 'modal', 'drawer']),
  minSelection: z.number().optional(),
  maxSelection: z.number().optional(),
  confirm: z.object({
    title: z.union([z.string(), z.function()]),
    content: z.union([z.string(), z.any(), z.function()]),
    okText: z.string().optional(),
    cancelText: z.string().optional(),
    okType: z.enum(['primary', 'danger']).optional(),
    centered: z.boolean().optional(),
  }).optional(),
  onExecute: z.function().optional(),
  href: z.union([z.string(), z.function()]).optional(),
  target: z.enum(['_blank', '_self', '_parent', '_top']).optional(),
  router: z.enum(['next', 'react-router', 'window']).optional(),
  group: z.string().optional(),
  priority: z.number().optional(),
  separator: z.boolean().optional(),
  className: z.string().optional(),
  style: z.any().optional(),
}).catchall(z.unknown())

// Entity actions config schema
export const EntityActionsConfigSchema = z.object({
  actions: z.array(EntityActionSchema),
  bulkActions: z.array(EntityBulkActionSchema).optional(),
  context: z.any().optional(),
  maxVisibleActions: z.number().optional(),
  showLabels: z.boolean().optional(),
  groupActions: z.boolean().optional(),
  showShortcuts: z.boolean().optional(),
  actionButtonVariant: z.enum(['default', 'outline', 'ghost', 'link']).optional(),
  actionButtonSize: z.enum(['sm', 'default', 'lg']).optional(),
  dropdownPlacement: z.enum(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']).optional(),
  permissions: z.object({
    check: z.function(),
    fallback: z.enum(['hide', 'disable']).optional(),
  }).optional(),
  hooks: z.object({
    onActionStart: z.function().optional(),
    onActionComplete: z.function().optional(),
    onActionError: z.function().optional(),
    onBulkActionStart: z.function().optional(),
    onBulkActionComplete: z.function().optional(),
    onBulkActionError: z.function().optional(),
  }).optional(),
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
 * Validate entity action configuration
 */
export function validateEntityAction(action: unknown): boolean {
  try {
    EntityActionSchema.parse(action)
    return true
  } catch (error) {
    console.error('EntityAction validation failed:', error)
    return false
  }
}

/**
 * Validate entity actions config
 */
export function validateEntityActionsConfig(config: unknown): boolean {
  try {
    EntityActionsConfigSchema.parse(config)
    return true
  } catch (error) {
    console.error('EntityActionsConfig validation failed:', error)
    return false
  }
}

/**
 * Validate bulk action
 */
export function validateEntityBulkAction(action: unknown): boolean {
  try {
    EntityBulkActionSchema.parse(action)
    return true
  } catch (error) {
    console.error('EntityBulkAction validation failed:', error)
    return false
  }
}

// ===== TYPE-SAFE VALIDATION WITH DETAILED ERRORS =====

/**
 * Validate entity action with detailed error information
 */
export function validateEntityActionWithErrors(action: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityActionSchema.safeParse(action)
}

/**
 * Validate entity actions config with detailed error information
 */
export function validateEntityActionsConfigWithErrors(config: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityActionsConfigSchema.safeParse(config)
}

/**
 * Validate bulk action with detailed error information
 */
export function validateEntityBulkActionWithErrors(action: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityBulkActionSchema.safeParse(action)
}

// ===== ADVANCED VALIDATION UTILITIES =====

/**
 * Validate an array of entity actions
 */
export function validateEntityActions(actions: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validActions: unknown[] = []

  actions.forEach((action, index) => {
    const result = EntityActionSchema.safeParse(action)
    if (result.success) {
      validActions.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`EntityAction validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validActions
  }
}

/**
 * Validate an array of bulk actions
 */
export function validateEntityBulkActions(actions: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validActions: unknown[] = []

  actions.forEach((action, index) => {
    const result = EntityBulkActionSchema.safeParse(action)
    if (result.success) {
      validActions.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`EntityBulkAction validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validActions
  }
}