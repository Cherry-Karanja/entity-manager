import { z } from "zod"

// ===== ZOD SCHEMAS FOR RUNTIME VALIDATION =====

// Export format schema
export const ExportFormatSchema = z.object({
  type: z.enum(['csv', 'xlsx', 'json', 'xml', 'pdf', 'txt']),
  label: z.string(),
  icon: z.function().optional(),
  extension: z.string(),
  mimeType: z.string(),
  enabled: z.boolean().optional(),
  options: z.record(z.unknown()).optional(),
})

// Export field schema
export const ExportFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'date', 'boolean']).optional(),
  format: z.function().optional(),
  width: z.number().optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  hidden: z.boolean().optional(),
})

// Export result schema
export const ExportResultSchema = z.object({
  success: z.boolean(),
  data: z.union([z.instanceof(Blob), z.string()]).optional(),
  filename: z.string(),
  format: z.enum(['csv', 'xlsx', 'json', 'xml', 'pdf', 'txt']),
  recordCount: z.number(),
  error: z.string().optional(),
})

// Entity exporter config schema
export const EntityExporterConfigSchema = z.object({
  // Export formats
  formats: z.array(ExportFormatSchema),

  // Data source
  data: z.array(z.unknown()).optional(),
  dataFetcher: z.function().optional(),
  dataTransformer: z.function().optional(),

  // Field configuration
  fields: z.array(ExportFieldSchema).optional(),
  fieldMapper: z.function().optional(),

  // Export options
  defaultFormat: z.enum(['csv', 'xlsx', 'json', 'xml', 'pdf', 'txt']).optional(),
  filename: z.union([z.string(), z.function()]).optional(),
  includeHeaders: z.boolean().optional(),
  delimiter: z.string().optional(),

  // UI configuration
  showFormatSelector: z.boolean().optional(),
  showProgress: z.boolean().optional(),
  showPreview: z.boolean().optional(),
  maxPreviewRows: z.number().optional(),

  // Permissions & hooks
  permissions: z.object({
    check: z.function(),
  }).optional(),
  hooks: z.object({
    onExportStart: z.function().optional(),
    onExportComplete: z.function().optional(),
    onExportError: z.function().optional(),
  }).optional(),

  // Styling
  className: z.string().optional(),
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
 * Validate export format
 */
export function validateExportFormat(format: unknown): boolean {
  try {
    ExportFormatSchema.parse(format)
    return true
  } catch (error) {
    console.error('ExportFormat validation failed:', error)
    return false
  }
}

/**
 * Validate export field
 */
export function validateExportField(field: unknown): boolean {
  try {
    ExportFieldSchema.parse(field)
    return true
  } catch (error) {
    console.error('ExportField validation failed:', error)
    return false
  }
}

/**
 * Validate export result
 */
export function validateExportResult(result: unknown): boolean {
  try {
    ExportResultSchema.parse(result)
    return true
  } catch (error) {
    console.error('ExportResult validation failed:', error)
    return false
  }
}

/**
 * Validate entity exporter config
 */
export function validateEntityExporterConfig(config: unknown): boolean {
  try {
    EntityExporterConfigSchema.parse(config)
    return true
  } catch (error) {
    console.error('EntityExporterConfig validation failed:', error)
    return false
  }
}

// ===== TYPE-SAFE VALIDATION WITH DETAILED ERRORS =====

/**
 * Validate export format with detailed error information
 */
export function validateExportFormatWithErrors(format: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ExportFormatSchema.safeParse(format)
}

/**
 * Validate export field with detailed error information
 */
export function validateExportFieldWithErrors(field: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ExportFieldSchema.safeParse(field)
}

/**
 * Validate export result with detailed error information
 */
export function validateExportResultWithErrors(result: unknown): z.SafeParseReturnType<unknown, unknown> {
  return ExportResultSchema.safeParse(result)
}

/**
 * Validate entity exporter config with detailed error information
 */
export function validateEntityExporterConfigWithErrors(config: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityExporterConfigSchema.safeParse(config)
}

// ===== ADVANCED VALIDATION UTILITIES =====

/**
 * Validate an array of export formats
 */
export function validateExportFormats(formats: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validFormats: unknown[] = []

  formats.forEach((format, index) => {
    const result = ExportFormatSchema.safeParse(format)
    if (result.success) {
      validFormats.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`ExportFormat validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validFormats
  }
}

/**
 * Validate an array of export fields
 */
export function validateExportFields(fields: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validFields: unknown[] = []

  fields.forEach((field, index) => {
    const result = ExportFieldSchema.safeParse(field)
    if (result.success) {
      validFields.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`ExportField validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validFields
  }
}