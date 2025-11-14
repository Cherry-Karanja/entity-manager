import { EntityExporterConfig, ExportFormat } from '@/components/entityManager/types'
import { UserProfileEntity } from './types'

// ===== USER PROFILE EXPORTER CONFIGURATION =====

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

export const exporterConfig: EntityExporterConfig<UserProfileEntity> = {
  // Export formats
  formats: exportFormats,
  defaultFormat: 'csv',
  
  // Field configuration for export
  fields: [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'user', label: 'User', type: 'string' },
    { key: 'job_title', label: 'Job Title', type: 'string' },
    { key: 'department', label: 'Department', type: 'string' },
    { key: 'phone_number', label: 'Phone', type: 'string' },
    { key: 'bio', label: 'Biography', type: 'string' },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'string',
      format: (value) => {
        const statusMap: Record<string, string> = {
          pending: 'Pending Approval',
          approved: 'Approved',
          rejected: 'Rejected',
          suspended: 'Suspended',
        }
        return statusMap[value as string] || value
      },
    },
    { 
      key: 'preferred_language', 
      label: 'Language', 
      type: 'string',
      format: (value) => {
        const langMap: Record<string, string> = {
          en: 'English',
          es: 'Spanish',
          fr: 'French',
          de: 'German',
          sw: 'Swahili',
        }
        return langMap[value as string] || value
      },
    },
    { 
      key: 'interface_theme', 
      label: 'Theme', 
      type: 'string',
      format: (value) => {
        const themeMap: Record<string, string> = {
          light: 'Light',
          dark: 'Dark',
          system: 'System',
        }
        return themeMap[value as string] || value
      },
    },
    { 
      key: 'allow_notifications', 
      label: 'Notifications', 
      type: 'boolean',
      format: (value) => value ? 'Enabled' : 'Disabled',
    },
    { 
      key: 'show_email', 
      label: 'Show Email Publicly', 
      type: 'boolean',
      format: (value) => value ? 'Yes' : 'No',
    },
    { 
      key: 'show_phone', 
      label: 'Show Phone Publicly', 
      type: 'boolean',
      format: (value) => value ? 'Yes' : 'No',
    },
    { key: 'approved_by', label: 'Approved By', type: 'string' },
    { 
      key: 'approved_at', 
      label: 'Approved At', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
    { 
      key: 'created_at', 
      label: 'Created', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
    { 
      key: 'updated_at', 
      label: 'Updated', 
      type: 'date',
      format: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
  ],
  
  // Export options
  filename: (format) => `user-profiles-${new Date().toISOString().split('T')[0]}.${format}`,
  includeHeaders: true,
  delimiter: ',',
  
  // UI configuration
  showFormatSelector: true,
  showProgress: true,
  showPreview: true,
  maxPreviewRows: 10,
  
  // Data transformation
  dataTransformer: (profiles) => {
    // Transform data as needed for export
    return profiles.map(profile => ({
      ...profile,
      // Example: Flatten nested user object if needed
    }))
  },
  
  // Hooks
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} user profiles as ${format}`)
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
  buttonText: 'Export',
}
