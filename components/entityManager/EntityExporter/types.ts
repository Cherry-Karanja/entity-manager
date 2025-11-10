import React from "react"

// ===== TYPE DEFINITIONS =====

export interface EntityExporterConfig {
  // Export formats
  formats: ExportFormat[]

  // Data source
  data?: unknown[]
  dataFetcher?: () => Promise<unknown[]>
  dataTransformer?: (data: unknown[]) => unknown[]

  // Field configuration
  fields?: ExportField[]
  fieldMapper?: (item: unknown) => Record<string, unknown>

  // Export options
  defaultFormat?: ExportFormatType
  filename?: string | ((format: ExportFormatType) => string)
  includeHeaders?: boolean
  delimiter?: string

  // UI configuration
  showFormatSelector?: boolean
  showProgress?: boolean
  showPreview?: boolean
  maxPreviewRows?: number

  // Permissions & hooks
  permissions?: {
    check: (permission: string) => boolean
  }
  hooks?: {
    onExportStart?: (format: ExportFormatType, data: unknown[]) => void
    onExportComplete?: (format: ExportFormatType, result: ExportResult) => void
    onExportError?: (format: ExportFormatType, error: unknown) => void
  }

  // Styling
  className?: string
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link'
  buttonSize?: 'sm' | 'default' | 'lg'
}

export interface ExportField {
  key: string
  label: string
  type?: 'string' | 'number' | 'date' | 'boolean'
  format?: (value: unknown, item: unknown) => string
  width?: number
  align?: 'left' | 'center' | 'right'
  hidden?: boolean
}

export type ExportFormatType = 'csv' | 'xlsx' | 'json' | 'xml' | 'pdf' | 'txt'

export interface ExportFormat {
  type: ExportFormatType
  label: string
  icon?: React.ComponentType<{ className?: string }>
  extension: string
  mimeType: string
  enabled?: boolean
  options?: Record<string, unknown>
}

export interface ExportResult {
  success: boolean
  data?: Blob | string
  filename: string
  format: ExportFormatType
  recordCount: number
  error?: string
  errorType?: 'validation' | 'no-data' | 'format' | 'serialization' | 'size-limit' | 'general'
}

export interface EntityExporterProps {
  config: EntityExporterConfig
  data?: unknown[]
  onExport?: (result: ExportResult) => void
  disabled?: boolean
  loading?: boolean
}

// ===== DEFAULT CONFIGURATIONS =====

export const DEFAULT_EXPORT_FORMATS: ExportFormat[] = [
  {
    type: 'csv',
    label: 'CSV',
    extension: 'csv',
    mimeType: 'text/csv',
    icon: () => React.createElement('span', null, '📊'),
  },
  {
    type: 'xlsx',
    label: 'Excel',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: () => React.createElement('span', null, '📈'),
  },
  {
    type: 'json',
    label: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    icon: () => React.createElement('span', null, '📋'),
  },
  {
    type: 'pdf',
    label: 'PDF',
    extension: 'pdf',
    mimeType: 'application/pdf',
    icon: () => React.createElement('span', null, '📄'),
  },
]

export const DEFAULT_EXPORTER_CONFIG: Partial<EntityExporterConfig> = {
  formats: DEFAULT_EXPORT_FORMATS,
  defaultFormat: 'csv',
  includeHeaders: true,
  delimiter: ',',
  showFormatSelector: true,
  showProgress: true,
  maxPreviewRows: 5,
  filename: (format) => `export_${new Date().toISOString().split('T')[0]}.${format}`,
  buttonVariant: 'outline',
  buttonSize: 'sm',
}