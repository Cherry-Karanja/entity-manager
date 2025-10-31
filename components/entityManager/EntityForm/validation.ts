import { z } from "zod"

// ===== ZOD SCHEMAS FOR RUNTIME VALIDATION =====

// Field option schema
export const FieldOptionSchema = z.object({
  label: z.string(),
  value: z.unknown(),
  disabled: z.boolean().optional(),
  icon: z.function().optional(),
  description: z.string().optional(),
})

// Validation rule schema
export const ValidationRuleSchema = z.object({
  type: z.enum(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern', 'email', 'url', 'custom']),
  value: z.unknown().optional(),
  message: z.string().optional(),
  validator: z.function().optional(),
})

// Form field schema
export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum([
    'text', 'email', 'password', 'number', 'tel', 'url', 'textarea', 'select',
    'multiselect', 'checkbox', 'radio', 'date', 'datetime', 'time', 'file',
    'switch', 'slider', 'color', 'json', 'custom'
  ]),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  helpText: z.string().optional(),

  // Field-specific options
  options: z.array(FieldOptionSchema).optional(),
  multiple: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  pattern: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  rows: z.number().optional(),
  cols: z.number().optional(),

  // Validation
  validation: z.array(ValidationRuleSchema).optional(),

  // UI customization
  width: z.union([z.number(), z.string()]).optional(),
  className: z.string().optional(),
  icon: z.function().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),

  // Advanced features
  dependsOn: z.string().optional(),
  condition: z.function().optional(),
  transform: z.function().optional(),
  format: z.function().optional(),
  parse: z.function().optional(),

  // Custom rendering
  render: z.function().optional(),
  component: z.function().optional(),
}).catchall(z.unknown())

// Bulk import format schema
export const BulkImportFormatSchema = z.object({
  type: z.enum(['csv', 'json', 'xml', 'xlsx']),
  label: z.string(),
  extension: z.string(),
  mimeType: z.string(),
  delimiter: z.string().optional(),
  hasHeaders: z.boolean().optional(),
  fieldMapping: z.record(z.string()).optional(),
})

// Entity form config schema
export const EntityFormConfigSchema = z.object({
  // Form fields configuration
  fields: z.array(FormFieldSchema),

  // Form behavior
  mode: z.enum(['create', 'edit', 'view']).optional(),
  layout: z.enum(['vertical', 'horizontal', 'grid']).optional(),
  columns: z.number().optional(),

  // Data handling
  initialData: z.record(z.unknown()).optional(),
  dataTransformer: z.function().optional(),
  submitTransformer: z.function().optional(),

  // Validation
  validationSchema: z.record(z.array(ValidationRuleSchema)).optional(),
  validateOnChange: z.boolean().optional(),
  validateOnBlur: z.boolean().optional(),

  // Submission
  onSubmit: z.function().optional(),
  onCancel: z.function().optional(),
  submitButtonText: z.string().optional(),
  cancelButtonText: z.string().optional(),

  // Bulk import
  enableBulkImport: z.boolean().optional(),
  bulkImportFormats: z.array(BulkImportFormatSchema).optional(),
  onBulkImport: z.function().optional(),

  // UI configuration
  showProgress: z.boolean().optional(),
  showValidationErrors: z.boolean().optional(),
  autoFocus: z.boolean().optional(),
  disabled: z.boolean().optional(),

  // Permissions & hooks
  permissions: z.object({
    create: z.boolean().optional(),
    edit: z.boolean().optional(),
    delete: z.boolean().optional(),
    import: z.boolean().optional(),
  }).optional(),
  hooks: z.object({
    onFormChange: z.function().optional(),
    onValidationError: z.function().optional(),
    onSubmitStart: z.function().optional(),
    onSubmitSuccess: z.function().optional(),
    onSubmitError: z.function().optional(),
    onBulkImportStart: z.function().optional(),
    onBulkImportSuccess: z.function().optional(),
    onBulkImportError: z.function().optional(),
  }).optional(),

  // Styling
  className: z.string().optional(),
  fieldSpacing: z.enum(['sm', 'md', 'lg']).optional(),
  buttonVariant: z.enum(['default', 'outline', 'ghost', 'link']).optional(),
  buttonSize: z.enum(['sm', 'default', 'lg']).optional(),
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
 * Validate form field
 */
export function validateFormField(field: unknown): boolean {
  try {
    FormFieldSchema.parse(field)
    return true
  } catch (error) {
    console.error('FormField validation failed:', error)
    return false
  }
}

/**
 * Validate validation rule
 */
export function validateValidationRule(rule: unknown): boolean {
  try {
    ValidationRuleSchema.parse(rule)
    return true
  } catch (error) {
    console.error('ValidationRule validation failed:', error)
    return false
  }
}

/**
 * Validate field option
 */
export function validateFieldOption(option: unknown): boolean {
  try {
    FieldOptionSchema.parse(option)
    return true
  } catch (error) {
    console.error('FieldOption validation failed:', error)
    return false
  }
}

/**
 * Validate bulk import format
 */
export function validateBulkImportFormat(format: unknown): boolean {
  try {
    BulkImportFormatSchema.parse(format)
    return true
  } catch (error) {
    console.error('BulkImportFormat validation failed:', error)
    return false
  }
}

/**
 * Validate entity form config
 */
export function validateEntityFormConfig(config: unknown): boolean {
  try {
    EntityFormConfigSchema.parse(config)
    return true
  } catch (error) {
    console.error('EntityFormConfig validation failed:', error)
    return false
  }
}

// ===== TYPE-SAFE VALIDATION WITH DETAILED ERRORS =====

/**
 * Validate form field with detailed error information
 */
export function validateFormFieldWithErrors(field: unknown): z.SafeParseReturnType<unknown, unknown> {
  return FormFieldSchema.safeParse(field)
}

/**
 * Validate validation rule with detailed error information
 */
export function validateValidationRuleWithErrors(rule: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ValidationRuleSchema.safeParse(rule)
}

/**
 * Validate field option with detailed error information
 */
export function validateFieldOptionWithErrors(option: unknown): z.SafeParseReturnType<unknown, unknown> {
  return FieldOptionSchema.safeParse(option)
}

/**
 * Validate bulk import format with detailed error information
 */
export function validateBulkImportFormatWithErrors(format: unknown): z.SafeParseReturnType<unknown, unknown> {
  return BulkImportFormatSchema.safeParse(format)
}

/**
 * Validate entity form config with detailed error information
 */
export function validateEntityFormConfigWithErrors(config: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityFormConfigSchema.safeParse(config)
}

// ===== ADVANCED VALIDATION UTILITIES =====

/**
 * Validate an array of form fields
 */
export function validateFormFields(fields: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validFields: unknown[] = []

  fields.forEach((field, index) => {
    const result = FormFieldSchema.safeParse(field)
    if (result.success) {
      validFields.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`FormField validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validFields
  }
}

/**
 * Validate an array of validation rules
 */
export function validateValidationRules(rules: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validRules: unknown[] = []

  rules.forEach((rule, index) => {
    const result = ValidationRuleSchema.safeParse(rule)
    if (result.success) {
      validRules.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`ValidationRule validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validRules
  }
}

/**
 * Validate an array of field options
 */
export function validateFieldOptions(options: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validOptions: unknown[] = []

  options.forEach((option, index) => {
    const result = FieldOptionSchema.safeParse(option)
    if (result.success) {
      validOptions.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`FieldOption validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validOptions
  }
}