// ===== USER PROFILE VIEW CONFIGURATION =====

export const userProfileViewConfig: {
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
      id: 'user-info',
      title: 'User Information',
      description: 'Basic user details',
      fields: [
        { key: 'user', label: 'User Account', type: 'text', copyable: true },
        { key: 'job_title', label: 'Job Title', type: 'text' },
        { key: 'department', label: 'Department', type: 'text' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Contact details and communication preferences',
      fields: [
        { key: 'phone_number', label: 'Phone Number', type: 'text', copyable: true },
        { key: 'preferred_language', label: 'Preferred Language', type: 'text' },
        { key: 'allow_notifications', label: 'Notifications', type: 'boolean' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'bio-section',
      title: 'Biography',
      description: 'User biography and description',
      fields: [
        { key: 'bio', label: 'Bio', type: 'text' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'preferences',
      title: 'Interface Preferences',
      description: 'User interface and display preferences',
      fields: [
        { key: 'interface_theme', label: 'Theme', type: 'text' },
        { key: 'show_email', label: 'Show Email Publicly', type: 'boolean' },
        { key: 'show_phone', label: 'Show Phone Publicly', type: 'boolean' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'approval-status',
      title: 'Approval Status',
      description: 'Profile approval and review status',
      fields: [
        { key: 'status', label: 'Status', type: 'text', badge: true, badgeVariant: 'secondary' },
        { key: 'approved_by', label: 'Approved By', type: 'text' },
        { key: 'approved_at', label: 'Approved At', type: 'text' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'timestamps',
      title: 'Profile Timeline',
      description: 'Profile creation and modification timestamps',
      fields: [
        { key: 'created_at', label: 'Created At', type: 'text' },
        { key: 'updated_at', label: 'Updated At', type: 'text' }
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