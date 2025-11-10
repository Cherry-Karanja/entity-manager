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
  fieldGroups?: {
    id: string
    title: string
    description?: string
    fields: string[]
    layout?: 'grid' | 'flex' | 'stack'
    columns?: number
    collapsible?: boolean
    collapsed?: boolean
  }[]
} = {
  title: 'User Information',
  createTitle: 'Create New User',
  editTitle: 'Edit User',
  description: 'Manage user account information and permissions',
  submitLabel: 'Save User',
  cancelLabel: 'Cancel',
  layout: 'grid',
  columns: 2,
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'User identification and contact details',
      fields: ['email', 'first_name', 'last_name', 'username', 'employee_id'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'role-permissions',
      title: 'Role & Permissions',
      description: 'Assign user roles and permissions',
      fields: ['role_name'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'account-status',
      title: 'Account Status',
      description: 'Account activation and verification status',
      fields: ['is_active', 'is_approved', 'is_verified', 'must_change_password'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'security-info',
      title: 'Security Information',
      description: 'Security-related account information',
      fields: ['failed_login_attempts', 'account_locked_until', 'last_login_ip'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: true
    },
    {
      id: 'timestamps',
      title: 'Timestamps',
      description: 'Account creation and activity timestamps',
      fields: ['date_joined', 'last_login', 'password_changed_at'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: true
    }
  ]
}