import { EntityExporterConfig, ExportFormat } from '@/components/entityManager/types'
import { LoginAttemptEntity } from './types'

// ===== LOGIN ATTEMPT EXPORTER CONFIGURATION =====

const exportFormats: ExportFormat[] = [
  {
    type: 'csv',
    label: 'CSV',
    extension: 'csv',
    mimeType: 'text/csv',
    enabled: true,
  },
  {
    type: 'xlsx',
    label: 'Excel',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    enabled: true,
  },
  {
    type: 'json',
    label: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    enabled: true,
  },
  {
    type: 'pdf',
    label: 'PDF',
    extension: 'pdf',
    mimeType: 'application/pdf',
    enabled: false, // Not implemented yet
  },
]

export const exporterConfig: EntityExporterConfig<LoginAttemptEntity> = {
  // Export formats
  formats: exportFormats,
  defaultFormat: 'csv',
  
  // Field configuration for export
  fields: [
    { key: 'id', label: 'Attempt ID', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'user', label: 'User', type: 'string' },
    { 
      key: 'success', 
      label: 'Status', 
      type: 'boolean',
      format: (value) => value ? 'Success' : 'Failed',
    },
    { key: 'failureReason', label: 'Failure Reason', type: 'string' },
    { key: 'ipAddress', label: 'IP Address', type: 'string' },
    { key: 'deviceType', label: 'Device Type', type: 'string' },
    { key: 'deviceOs', label: 'Operating System', type: 'string' },
    { key: 'browser', label: 'Browser', type: 'string' },
    { key: 'userAgent', label: 'User Agent', type: 'string' },
    { 
      key: 'locationInfo', 
      label: 'Location', 
      type: 'string',
      format: (value) => {
        if (!value) return ''
        if (typeof value === 'object') {
          return JSON.stringify(value)
        }
        return value as string
      },
    },
    { key: 'sessionId', label: 'Session ID', type: 'string' },
    { 
      key: 'createdAt', 
      label: 'Attempt Time', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
  ],
  
  // Export options
  filename: (format) => `login-attempts-${new Date().toISOString().split('T')[0]}.${format}`,
  includeHeaders: true,
  delimiter: ',',
  
  // UI configuration
  showFormatSelector: true,
  showProgress: true,
  showPreview: true,
  maxPreviewRows: 10,
  
  // Data transformation
  dataTransformer: (attempts) => {
    // Transform data for export (e.g., flatten nested objects)
    return attempts as LoginAttemptEntity[]
  },
  
  // Hooks
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} login attempts as ${format}`)
    },
    onExportComplete: (format, result) => {
      console.log(`Export completed: ${result.filename}`)
    },
    onExportError: (format, error) => {
      console.error(`Export failed:`, error)
    },
  },
  
  // Styling
  buttonVariant: 'outline',
  buttonSize: 'default',
}
