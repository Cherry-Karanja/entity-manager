// ===== USER VIEW CONFIGURATION =====

export const userViewConfig: {
  mode?: 'card' | 'list' | 'table' | 'detail' | 'summary' | 'timeline' | 'gallery' | 'custom'
  layout?: 'single' | 'grid' | 'masonry' | 'list' | 'tabs' | 'accordion'
  fieldGroups?: any[]
  showHeader?: boolean
  showActions?: boolean
  showMetadata?: boolean
  compact?: boolean
} = {
  mode: 'detail',
  layout: 'single',
  fieldGroups: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      fields: [
        { key: 'first_name', label: 'First Name', type: 'text' },
        { key: 'last_name', label: 'Last Name', type: 'text' },
        { key: 'get_full_name', label: 'Full Name', type: 'text', copyable: true },
        { key: 'email', label: 'Email', type: 'email', copyable: true },
        { key: 'phone_number', label: 'Phone', type: 'phone', copyable: true },
        { key: 'national_id', label: 'National ID', type: 'text', copyable: true }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'account-info',
      title: 'Account Information',
      fields: [
        { key: 'user_type', label: 'User Type', type: 'badge' },
        { key: 'is_active', label: 'Active Status', type: 'boolean' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'timestamps',
      title: 'Timestamps',
      fields: [
        { key: 'date_joined', label: 'Date Joined', type: 'date' },
        { key: 'updated_at', label: 'Last Updated', type: 'datetime' }
      ],
      layout: 'horizontal',
      collapsible: true,
      collapsed: true
    }
  ],
  showHeader: true,
  showActions: true,
  showMetadata: true,
  compact: false
}
