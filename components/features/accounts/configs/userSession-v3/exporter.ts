import { EntityExporterConfig, ExportFormat } from '@/components/entityManager/types'
import { UserSessionEntity } from './types'

// ===== USER SESSION EXPORTER CONFIGURATION =====

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

export const exporterConfig: EntityExporterConfig<UserSessionEntity> = {
  // Export formats
  formats: exportFormats,
  defaultFormat: 'csv',
  
  // Field configuration for export
  fields: [
    { key: 'id', label: 'Session ID', type: 'string' },
    { key: 'user', label: 'User', type: 'string' },
    { key: 'ip_address', label: 'IP Address', type: 'string' },
    { key: 'device_type', label: 'Device Type', type: 'string' },
    { key: 'device_os', label: 'Operating System', type: 'string' },
    { key: 'browser', label: 'Browser', type: 'string' },
    { 
      key: 'is_active', 
      label: 'Status', 
      type: 'boolean',
      format: (value) => value ? 'Active' : 'Inactive',
    },
    { 
      key: 'last_activity', 
      label: 'Last Activity', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
    { 
      key: 'expires_at', 
      label: 'Expires At', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
    { 
      key: 'created_at', 
      label: 'Created At', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
  ],
  
  // Export options
  filename: (format) => `user-sessions-${new Date().toISOString().split('T')[0]}.${format}`,
  includeHeaders: true,
  delimiter: ',',
  
  // UI configuration
  showFormatSelector: true,
  showProgress: true,
  showPreview: true,
  maxPreviewRows: 10,
  
  // Data transformation
  dataTransformer: (sessions) => {
    // Remove sensitive data or transform as needed
    return sessions.map(session => {
      const transformed = { ...session }
      // Mask session_key for security
      transformed.session_key = '***MASKED***'
      // Note: location_info transformation would need to be done differently
      // if we want to maintain type compatibility
      return transformed
    })
  },
  
  // Hooks
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} sessions as ${format}`)
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
