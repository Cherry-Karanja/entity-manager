import { EntityExporterConfig, ExportFormat } from '@/components/entityManager/types'
import { UserEntity } from './types'

// ===== USER EXPORTER CONFIGURATION =====

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

export const exporterConfig: EntityExporterConfig<UserEntity> = {
  // Export formats
  formats: exportFormats,
  defaultFormat: 'csv',
  
  // Field configuration for export
  fields: [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'firstName', label: 'First Name', type: 'string' },
    { key: 'lastName', label: 'Last Name', type: 'string' },
    { key: 'username', label: 'Username', type: 'string' },
    { key: 'role', label: 'Role', type: 'string' },
    { 
      key: 'isActive', 
      label: 'Status', 
      type: 'boolean',
      format: (value) => value ? 'Active' : 'Inactive',
    },
    { key: 'phoneNumber', label: 'Phone', type: 'string' },
    { 
      key: 'dateJoined', 
      label: 'Date Joined', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleDateString() : '',
    },
  ],
  
  // Export options
  filename: (format) => `users-${new Date().toISOString().split('T')[0]}.${format}`,
  includeHeaders: true,
  delimiter: ',',
  
  // UI configuration
  showFormatSelector: true,
  showProgress: true,
  showPreview: true,
  maxPreviewRows: 10,
  
  // Data transformation
  dataTransformer: (users) => {
    // Remove sensitive data or transform as needed
    return users.map(user => ({
      ...user,
      // Example: Remove password field if present
    }))
  },
  
  // Hooks
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} users as ${format}`)
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
