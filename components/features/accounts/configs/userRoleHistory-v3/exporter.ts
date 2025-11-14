import { EntityExporterConfig, ExportFormat } from '@/components/entityManager/types'
import { UserRoleHistoryEntity } from './types'

// ===== USER ROLE HISTORY EXPORTER CONFIGURATION =====

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

export const exporterConfig: EntityExporterConfig<UserRoleHistoryEntity> = {
  // Export formats
  formats: exportFormats,
  defaultFormat: 'csv',
  
  // Field configuration for export
  fields: [
    { key: 'id', label: 'Record ID', type: 'string' },
    { key: 'user', label: 'User', type: 'string' },
    { 
      key: 'old_role', 
      label: 'Previous Role', 
      type: 'string',
      format: (value) => value ? String(value) : 'None',
    },
    { 
      key: 'new_role', 
      label: 'New Role', 
      type: 'string',
      format: (value) => value ? String(value) : 'None',
    },
    { 
      key: 'changed_by', 
      label: 'Changed By', 
      type: 'string',
      format: (value) => value ? String(value) : 'System',
    },
    { key: 'reason', label: 'Change Reason', type: 'string' },
    { 
      key: 'created_at', 
      label: 'Change Date', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
  ],
  
  // Export options
  filename: (format) => `role-history-${new Date().toISOString().split('T')[0]}.${format}`,
  includeHeaders: true,
  delimiter: ',',
  
  // UI configuration
  showFormatSelector: true,
  showProgress: true,
  showPreview: true,
  maxPreviewRows: 10,
  
  // Data transformation
  dataTransformer: (records) => {
    // Transform data for export
    return records.map(record => ({
      ...record,
      old_role: record.old_role || 'None',
      new_role: record.new_role || 'None',
      changed_by: record.changed_by || 'System',
    }))
  },
  
  // Hooks
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} role history records as ${format}`)
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
