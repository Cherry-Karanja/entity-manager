import { EntityViewConfig } from '@/components/entityManager/types'
import { UserProfileEntity } from './types'

// ===== USER PROFILE VIEW CONFIGURATION =====

export const viewConfig: EntityViewConfig<UserProfileEntity> = {
  // View mode and layout
  mode: 'detail',
  layout: 'single',
  theme: 'default',
  
  // Display options
  showHeader: true,
  showActions: true,
  showMetadata: true,
  showNavigation: false,
  compact: false,
  
  // Field groups for organized display
  fieldGroups: [
    {
      id: 'user-info',
      title: 'User Information',
      description: 'Basic user details and role',
      collapsed: false,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'user',
          label: 'User Account',
          type: 'text',
          copyable: true,
        },
        {
          key: 'status',
          label: 'Status',
          type: 'badge',
          format: (value) => {
            const statusMap: Record<string, string> = {
              pending: '⏳ Pending Approval',
              approved: '✅ Approved',
              rejected: '❌ Rejected',
              suspended: '🚫 Suspended',
            }
            return statusMap[value as string] || value
          },
        },
        {
          key: 'job_title',
          label: 'Job Title',
          type: 'text',
        },
        {
          key: 'department',
          label: 'Department',
          type: 'text',
        },
      ],
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Contact details and communication preferences',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'phone_number',
          label: 'Phone Number',
          type: 'phone',
          copyable: true,
        },
        {
          key: 'bio',
          label: 'Biography',
          type: 'text',
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Interface Preferences',
      description: 'User interface and display preferences',
      collapsed: true,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'preferred_language',
          label: 'Preferred Language',
          type: 'text',
          format: (value) => {
            const langMap: Record<string, string> = {
              en: '🇬🇧 English',
              es: '🇪🇸 Spanish',
              fr: '🇫🇷 French',
              de: '🇩🇪 German',
              sw: '🇰🇪 Swahili',
            }
            return langMap[value as string] || value
          },
        },
        {
          key: 'interface_theme',
          label: 'Interface Theme',
          type: 'badge',
          format: (value) => {
            const themeMap: Record<string, string> = {
              light: '☀️ Light',
              dark: '🌙 Dark',
              system: '💻 System',
            }
            return themeMap[value as string] || value
          },
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      description: 'Privacy and notification preferences',
      collapsed: true,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'allow_notifications',
          label: 'Notifications Enabled',
          type: 'badge',
          format: (value) => (value ? '✅ Yes' : '❌ No'),
        },
        {
          key: 'show_email',
          label: 'Show Email Publicly',
          type: 'badge',
          format: (value) => (value ? '✅ Yes' : '❌ No'),
        },
        {
          key: 'show_phone',
          label: 'Show Phone Publicly',
          type: 'badge',
          format: (value) => (value ? '✅ Yes' : '❌ No'),
        },
      ],
    },
    {
      id: 'approval-status',
      title: 'Approval Information',
      description: 'Profile approval and review details',
      collapsed: true,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'approved_by',
          label: 'Approved By',
          type: 'text',
        },
        {
          key: 'approved_at',
          label: 'Approved At',
          type: 'date',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'Not approved',
        },
      ],
    },
    {
      id: 'timestamps',
      title: 'Timeline',
      description: 'Profile creation and modification history',
      collapsed: true,
      collapsible: true,
      layout: 'horizontal',
      fields: [
        {
          key: 'created_at',
          label: 'Created',
          type: 'date',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'updated_at',
          label: 'Last Updated',
          type: 'date',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
      ],
    },
  ],
  
  // Actions
  actions: [
    {
      id: 'edit',
      label: 'Edit',
      type: 'primary',
    },
    {
      id: 'delete',
      label: 'Delete',
      type: 'default',
      danger: true,
    },
  ],
  
  // Metadata
  metadata: {
    showCreatedAt: true,
    showUpdatedAt: true,
    showCreatedBy: false,
    showUpdatedBy: false,
  },
}
