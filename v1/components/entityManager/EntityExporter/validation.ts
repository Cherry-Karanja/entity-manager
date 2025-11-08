import { z } from "zod"

// Import types
import type { ExportFormatType } from "./types"

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
  errorType: z.enum(['validation', 'no-data', 'format', 'serialization', 'size-limit', 'general']).optional(),
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

/**
 * Validate export data structure and content
 */
export function validateExportData(data: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []

  if (!Array.isArray(data)) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'invalid_type',
        expected: 'array',
        received: typeof data,
        path: [],
        message: 'Export data must be an array'
      }])]
    }
  }

  if (data.length === 0) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'too_small',
        minimum: 1,
        inclusive: true,
        type: 'array',
        path: [],
        message: 'Export data cannot be empty'
      }])]
    }
  }

  // Check for consistent structure
  const firstItem = data[0]
  if (typeof firstItem !== 'object' || firstItem === null) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'invalid_type',
        expected: 'object',
        received: typeof firstItem,
        path: [0],
        message: 'Export data items must be objects'
      }])]
    }
  }

  // Validate each item has consistent keys
  const expectedKeys = Object.keys(firstItem)
  for (let i = 1; i < data.length; i++) {
    const item = data[i]
    if (typeof item !== 'object' || item === null) {
      errors.push(new z.ZodError([{
        code: 'invalid_type',
        expected: 'object',
        received: typeof item,
        path: [i],
        message: `Item at index ${i} must be an object`
      }]))
    } else {
      const itemKeys = Object.keys(item)
      const missingKeys = expectedKeys.filter(key => !itemKeys.includes(key))
      const extraKeys = itemKeys.filter(key => !expectedKeys.includes(key))

      if (missingKeys.length > 0) {
        errors.push(new z.ZodError([{
          code: 'invalid_type',
          expected: 'object',
          received: 'object',
          path: [i],
          message: `Item at index ${i} is missing keys: ${missingKeys.join(', ')}`
        }]))
      }

      if (extraKeys.length > 0) {
        errors.push(new z.ZodError([{
          code: 'invalid_type',
          expected: 'object',
          received: 'object',
          path: [i],
          message: `Item at index ${i} has extra keys: ${extraKeys.join(', ')}`
        }]))
      }
    }
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data
  }
}

/**
 * Validate CSV-specific requirements
 */
export function validateCSVExport(data: unknown[], delimiter: string = ','): ValidationResult {
  const errors: z.ZodError[] = []

  if (data.length === 0) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'too_small',
        minimum: 1,
        inclusive: true,
        type: 'array',
        path: [],
        message: 'CSV export data cannot be empty'
      }])]
    }
  }

  // Check for delimiter conflicts
  data.forEach((item, index) => {
    if (typeof item === 'object' && item !== null) {
      Object.entries(item).forEach(([key, value]) => {
        const stringValue = String(value || '')
        if (stringValue.includes(delimiter)) {
          errors.push(new z.ZodError([{
            code: 'invalid_string',
            validation: 'regex',
            path: [index, key],
            message: `Value contains delimiter '${delimiter}' which may cause parsing issues`
          }]))
        }
        if (stringValue.includes('"')) {
          errors.push(new z.ZodError([{
            code: 'invalid_string',
            validation: 'regex',
            path: [index, key],
            message: `Value contains quotes which may cause parsing issues`
          }]))
        }
        if (stringValue.includes('\n') || stringValue.includes('\r')) {
          errors.push(new z.ZodError([{
            code: 'invalid_string',
            validation: 'regex',
            path: [index, key],
            message: `Value contains line breaks which may cause parsing issues`
          }]))
        }
      })
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Validate JSON export data
 */
export function validateJSONExport(data: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []

  try {
    // Test JSON serialization
    JSON.stringify(data)
  } catch (error) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'custom',
        path: [],
        message: `JSON serialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }])]
    }
  }

  // Check for circular references (basic check)
  const seen = new WeakSet()
  const checkCircular = (obj: unknown, path: (string | number)[] = []): boolean => {
    if (typeof obj === 'object' && obj !== null) {
      if (seen.has(obj)) {
        errors.push(new z.ZodError([{
          code: 'custom',
          path,
          message: 'Circular reference detected'
        }]))
        return false
      }
      seen.add(obj)

      if (Array.isArray(obj)) {
        obj.forEach((item, index) => checkCircular(item, [...path, index]))
      } else {
        Object.entries(obj).forEach(([key, value]) => checkCircular(value, [...path, key]))
      }
    }
    return true
  }

  data.forEach((item, index) => checkCircular(item, [index]))

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Validate field mappings
 */
export function validateFieldMappings(
  data: unknown[],
  fields?: Array<{ key: string; label: string }>
): ValidationResult {
  const errors: z.ZodError[] = []

  if (!fields || fields.length === 0) {
    return { success: true }
  }

  if (data.length === 0) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'too_small',
        minimum: 1,
        inclusive: true,
        type: 'array',
        path: [],
        message: 'Cannot validate field mappings with empty data'
      }])]
    }
  }

  const firstItem = data[0]
  if (typeof firstItem !== 'object' || firstItem === null) {
    return {
      success: false,
      errors: [new z.ZodError([{
        code: 'invalid_type',
        expected: 'object',
        received: typeof firstItem,
        path: [0],
        message: 'Data items must be objects for field mapping validation'
      }])]
    }
  }

  const availableKeys = Object.keys(firstItem)

  fields.forEach((field, index) => {
    if (!availableKeys.includes(field.key)) {
      errors.push(new z.ZodError([{
        code: 'invalid_enum_value',
        options: availableKeys,
        received: field.key,
        path: ['fields', index, 'key'],
        message: `Field key '${field.key}' not found in data. Available keys: ${availableKeys.join(', ')}`
      }]))
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Validate export size limits
 */
export function validateExportSize(
  data: unknown[],
  format: ExportFormatType,
  maxRecords?: number,
  maxFileSizeMB?: number
): ValidationResult {
  const errors: z.ZodError[] = []

  const defaultMaxRecords = 100000
  const defaultMaxFileSizeMB = 50

  const actualMaxRecords = maxRecords || defaultMaxRecords
  const actualMaxFileSizeMB = maxFileSizeMB || defaultMaxFileSizeMB

  if (data.length > actualMaxRecords) {
    errors.push(new z.ZodError([{
      code: 'too_big',
      maximum: actualMaxRecords,
      inclusive: true,
      type: 'array',
      path: [],
      message: `Export exceeds maximum record limit of ${actualMaxRecords} (${data.length} records)`
    }]))
  }

  // Estimate file size (rough approximation)
  const estimatedSizeBytes = estimateExportSize(data, format)
  const estimatedSizeMB = estimatedSizeBytes / (1024 * 1024)

  if (estimatedSizeMB > actualMaxFileSizeMB) {
    errors.push(new z.ZodError([{
      code: 'too_big',
      maximum: actualMaxFileSizeMB,
      inclusive: true,
      type: 'number',
      path: [],
      message: `Estimated export size (${estimatedSizeMB.toFixed(2)} MB) exceeds limit of ${actualMaxFileSizeMB} MB`
    }]))
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Estimate export file size (rough approximation)
 */
function estimateExportSize(data: unknown[], format: ExportFormatType): number {
  const sampleSize = Math.min(data.length, 100)
  const sample = data.slice(0, sampleSize)

  let sampleContent = ''
  switch (format) {
    case 'json':
      sampleContent = JSON.stringify(sample)
      break
    case 'csv':
      if (sample.length > 0) {
        const headers = Object.keys(sample[0] as object)
        sampleContent = headers.join(',') + '\n'
        sample.forEach(item => {
          const values = headers.map(key => String((item as any)[key] || ''))
          sampleContent += values.join(',') + '\n'
        })
      }
      break
    case 'xml':
      sampleContent = '<?xml version="1.0"?><items>'
      sample.forEach(item => {
        sampleContent += '<item>'
        Object.entries(item as object).forEach(([key, value]) => {
          sampleContent += `<${key}>${String(value)}</${key}>`
        })
        sampleContent += '</item>'
      })
      sampleContent += '</items>'
      break
    default:
      sampleContent = JSON.stringify(sample)
  }

  // Scale up for full dataset
  const scaleFactor = data.length / sampleSize
  return Math.ceil(sampleContent.length * scaleFactor)
}

/**
 * Comprehensive export validation
 */
export function validateExportOperation(
  config: unknown,
  data: unknown[],
  format: ExportFormatType
): ValidationResult {
  const errors: z.ZodError[] = []

  // Validate config
  const configResult = validateEntityExporterConfigWithErrors(config)
  if (!configResult.success) {
    // Create a ZodError from the issues
    const configError = new z.ZodError(configResult.error.errors)
    errors.push(configError)
  }

  // Validate data structure
  const dataResult = validateExportData(data)
  if (!dataResult.success && dataResult.errors) {
    errors.push(...dataResult.errors)
  }

  // Format-specific validation
  switch (format) {
    case 'csv':
      const csvResult = validateCSVExport(data, (config as any)?.delimiter || ',')
      if (!csvResult.success && csvResult.errors) {
        errors.push(...csvResult.errors)
      }
      break
    case 'json':
      const jsonResult = validateJSONExport(data)
      if (!jsonResult.success && jsonResult.errors) {
        errors.push(...jsonResult.errors)
      }
      break
  }

  // Validate field mappings
  const fieldsResult = validateFieldMappings(data, (config as any)?.fields)
  if (!fieldsResult.success && fieldsResult.errors) {
    errors.push(...fieldsResult.errors)
  }

  // Validate size limits
  const sizeResult = validateExportSize(data, format)
  if (!sizeResult.success && sizeResult.errors) {
    errors.push(...sizeResult.errors)
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}