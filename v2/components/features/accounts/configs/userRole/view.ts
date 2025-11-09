// ===== USER ROLE VIEW CONFIGURATION =====

export const userRoleViewConfig: {
  mode?: 'card' | 'list' | 'table' | 'detail' | 'summary' | 'timeline' | 'gallery' | 'custom'
  layout?: 'single' | 'grid' | 'masonry' | 'list' | 'tabs' | 'accordion'
  fieldGroups?: {
    id: string
    title: string
    description?: string
    fields: {
      key: string
      label: string
      type: string
      copyable?: boolean
      format?: string
      badge?: boolean
      badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }[]
    layout?: 'grid' | 'vertical' | 'horizontal'
    columns?: number
    collapsible?: boolean
    collapsed?: boolean
  }[]
  showHeader?: boolean
  showActions?: boolean
  showMetadata?: boolean
  compact?: boolean
} = {
  mode: 'detail',
  layout: 'single',
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Role identification and status',
      fields: [
        { key: 'name', label: 'Role Name', type: 'text', copyable: true },
        { key: 'display_name', label: 'Display Name', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'is_active', label: 'Active Status', type: 'boolean' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'Permissions assigned to this role',
      fields: [
        { key: 'permissions', label: 'Assigned Permissions', type: 'array', format: 'badge-list' },
        { key: 'permissions_count', label: 'Total Permissions', type: 'number', badge: true, badgeVariant: 'secondary' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'usage',
      title: 'Usage Statistics',
      description: 'Current usage of this role',
      fields: [
        { key: 'users_count', label: 'Assigned Users', type: 'number', badge: true, badgeVariant: 'default' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'timestamps',
      title: 'Role Timeline',
      description: 'Role creation and modification timestamps',
      fields: [
        { key: 'created_at', label: 'Created At', type: 'datetime' },
        { key: 'updated_at', label: 'Updated At', type: 'datetime' }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: true
    }
  ],
  showHeader: true,
  showActions: true,
  showMetadata: true,
  compact: false
}