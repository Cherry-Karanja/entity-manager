// ===== USER PROFILE FORM CONFIGURATION =====

export const userProfileFormConfig: {
  title?: string
  createTitle?: string
  editTitle?: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  layout?: 'grid' | 'flex' | 'stack'
  fieldGroups?: {
    id: string
    title: string
    description?: string
    fields: string[]
    layout?: 'grid' | 'vertical' | 'horizontal'
    columns?: number
    collapsible?: boolean
    collapsed?: boolean
  }[]
} = {
  title: 'User Profile',
  createTitle: 'Create User Profile',
  editTitle: 'Edit User Profile',
  description: 'Manage user profile information and preferences',
  submitLabel: 'Save Profile',
  cancelLabel: 'Cancel',
  layout: 'grid',
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'User identification and contact details',
      fields: ['user', 'job_title', 'department', 'phone_number'],
      layout: 'grid',
      columns: 2,
      collapsible: false
    },
    {
      id: 'bio-section',
      title: 'Biography',
      description: 'User biography and description',
      fields: ['bio'],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'User interface and communication preferences',
      fields: ['preferred_language', 'interface_theme', 'allow_notifications'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      description: 'Control what information is visible to others',
      fields: ['show_email', 'show_phone'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'approval-status',
      title: 'Approval Status',
      description: 'Profile approval and review information',
      fields: ['status', 'approved_by', 'approved_at'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: true
    },
    {
      id: 'timestamps',
      title: 'Timestamps',
      description: 'Profile creation and modification timestamps',
      fields: ['created_at', 'updated_at'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: true
    }
  ]
}