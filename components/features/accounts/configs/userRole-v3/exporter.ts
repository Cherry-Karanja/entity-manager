import { EntityExporterConfig, ExportFormat } from '@/components/entityManager/types'
import { UserRoleEntity } from './types'

// ===== USER ROLE EXPORTER CONFIGURATION =====

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

export const exporterConfig: EntityExporterConfig<UserRoleEntity> = {
  // Export formats
  formats: exportFormats,
  defaultFormat: 'csv',
  
  // Field configuration for export
  fields: [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'name', label: 'Role Name', type: 'string' },
    { key: 'display_name', label: 'Display Name', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    { 
      key: 'is_active', 
      label: 'Status', 
      type: 'boolean',
      format: (value) => value ? 'Active' : 'Inactive',
    },
    { 
      key: 'permissions', 
      label: 'Permissions', 
      type: 'string',
      format: (value) => {
        if (!value || !Array.isArray(value)) return ''
        return value.join('; ')
      },
    },
    { key: 'permissions_count', label: 'Permissions Count', type: 'number' },
    { key: 'users_count', label: 'Users Count', type: 'number' },
    { 
      key: 'created_at', 
      label: 'Created At', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
    { 
      key: 'updated_at', 
      label: 'Updated At', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
  ],
  
  // Export options
  filename: (format) => `roles-${new Date().toISOString().split('T')[0]}.${format}`,
  includeHeaders: true,
  delimiter: ',',
  
  // UI configuration
  showFormatSelector: true,
  showProgress: true,
  showPreview: true,
  maxPreviewRows: 10,
  
  // Data transformation
  dataTransformer: (roles) => {
    // Remove sensitive data or transform as needed
    return roles.map(role => ({
      ...role,
      // Example: Additional data transformation if needed
    }))
  },
  
  // Hooks
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} roles as ${format}`)
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
