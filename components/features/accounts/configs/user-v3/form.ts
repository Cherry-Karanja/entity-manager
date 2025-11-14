import { EntityFormConfig } from '@/components/entityManager/types'
import { UserEntity } from './types'
import { userFields } from './fields'

// ===== USER FORM CONFIGURATION =====

export const formConfig: EntityFormConfig<UserEntity> = {
  // Use centralized field definitions
  fields: userFields,
  
  // Layout
  layout: 'grid',
  columns: 2,
  fieldSpacing: 'md',
  
  // Validation
  validationMode: 'onBlur',
  validateOnChange: false,
  validateOnBlur: true,
  
  // Submission
  submitButtonText: 'Save User',
  cancelButtonText: 'Cancel',
  submitSuccessMessage: 'User saved successfully',
  
  // UI
  showProgress: false,
  showValidationErrors: true,
  autoFocus: true,
  
  // Permissions
  permissions: {
    create: true,
    edit: true,
    delete: false, // Deletion handled by actions
    import: true,
  },
  
  // Bulk import
  enableBulkImport: true,
  bulkImportFormats: [
    {
      type: 'csv',
      label: 'CSV',
      extension: 'csv',
      mimeType: 'text/csv',
      delimiter: ',',
      hasHeaders: true,
    },
    {
      type: 'json',
      label: 'JSON',
      extension: 'json',
      mimeType: 'application/json',
    },
  ],
}
