import { EntityFormConfig } from '@/components/entityManager/types'
import { UserRoleEntity } from './types'
import { userRoleFields } from './fields'

// ===== USER ROLE FORM CONFIGURATION =====

export const formConfig: EntityFormConfig<UserRoleEntity> = {
  // Use centralized field definitions
  fields: userRoleFields,
  
  // Layout
  layout: 'grid',
  columns: 1,
  fieldSpacing: 'md',
  
  // Validation
  validationMode: 'onBlur',
  validateOnChange: false,
  validateOnBlur: true,
  
  // Submission
  submitButtonText: 'Save Role',
  cancelButtonText: 'Cancel',
  submitSuccessMessage: 'Role saved successfully',
  
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
