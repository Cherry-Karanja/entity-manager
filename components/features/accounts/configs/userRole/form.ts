// ===== USER ROLE FORM CONFIGURATION =====

export const userRoleFormConfig: {
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
  title: 'Role Information',
  createTitle: 'Create New Role',
  editTitle: 'Edit Role',
  description: 'Define role properties and assign permissions',
  submitLabel: 'Save Role',
  cancelLabel: 'Cancel',
  layout: 'grid',
  columns: 1,
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Role identification and description',
      fields: ['name', 'display_name', 'description', 'is_active'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'Assign permissions to this role',
      fields: ['permissions'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'statistics',
      title: 'Role Statistics',
      description: 'Current usage statistics',
      fields: ['permissions_count', 'users_count'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: true
    },
    {
      id: 'timestamps',
      title: 'Timestamps',
      description: 'Role creation and modification timestamps',
      fields: ['created_at', 'updated_at'],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: true
    }
  ]
}