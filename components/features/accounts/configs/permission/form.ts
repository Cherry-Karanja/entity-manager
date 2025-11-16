// ===== PERMISSION FORM CONFIGURATION =====

export const permissionFormConfig: {
  title?: string
  createTitle?: string
  editTitle?: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: number
  fieldGroups?: {
    id: string
    title: string
    description?: string
    fields: string[]
    layout?: 'vertical' | 'horizontal' | 'grid'
    columns?: number
    collapsible?: boolean
    collapsed?: boolean
  }[]
} = {
  title: 'Permission Information',
  createTitle: 'Create New Permission',
  editTitle: 'Edit Permission',
  description: 'Define a new permission for the system',
  submitLabel: 'Save Permission',
  cancelLabel: 'Cancel',
  layout: 'grid',
  columns: 1,
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Permission identification and description',
      fields: ['name', 'codename'],
      layout: 'grid',
      columns: 2,
      collapsible: false,
      collapsed: false
    },
    {
      id: 'content-type',
      title: 'Content Type',
      description: 'Specify the app and model this permission applies to',
      fields: ['app_label', 'model'],
      layout: 'grid',
      columns: 2,
      collapsible: false,
      collapsed: false
    },
    {
      id: 'metadata',
      title: 'Metadata',
      description: 'Additional information about this permission',
      fields: ['content_type_name'],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: true
    }
  ]
}