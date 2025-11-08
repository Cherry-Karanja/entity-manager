// ===== USER FORM CONFIGURATION =====

export const userFormConfig: {
  title?: string
  createTitle?: string
  editTitle?: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  layout?: 'grid' | 'flex' | 'stack'
  columns?: number
} = {
  title: 'User Information',
  createTitle: 'Create New User',
  editTitle: 'Edit User',
  description: 'Manage user account information and permissions',
  submitLabel: 'Save User',
  cancelLabel: 'Cancel',
  layout: 'grid',
  columns: 2
}
