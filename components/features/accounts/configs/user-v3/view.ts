import { EntityViewConfig } from '@/components/entityManager/types'
import { UserEntity } from './types'

// ===== USER VIEW CONFIGURATION =====

export const viewConfig: EntityViewConfig<UserEntity> = {
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
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Core user details',
      collapsed: false,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          copyable: true,
        },
        {
          key: 'username',
          label: 'Username',
          type: 'text',
        },
        {
          key: 'firstName',
          label: 'First Name',
          type: 'text',
        },
        {
          key: 'lastName',
          label: 'Last Name',
          type: 'text',
        },
      ],
    },
    {
      id: 'role-status',
      title: 'Role & Status',
      collapsed: false,
      collapsible: true,
      layout: 'horizontal',
      fields: [
        {
          key: 'role',
          label: 'Role',
          type: 'badge',
          format: (value) => {
            const roleMap: Record<string, string> = {
              admin: '👑 Administrator',
              user: '👤 User',
              guest: '🎭 Guest',
              moderator: '⚖️ Moderator',
            }
            return roleMap[value as string] || value
          },
        },
        {
          key: 'isActive',
          label: 'Status',
          type: 'badge',
          format: (value) => (value ? '✅ Active' : '❌ Inactive'),
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      collapsed: true,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'phoneNumber',
          label: 'Phone Number',
          type: 'phone',
        },
        {
          key: 'bio',
          label: 'Biography',
          type: 'text',
        },
      ],
    },
    {
      id: 'metadata',
      title: 'System Information',
      collapsed: true,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'dateJoined',
          label: 'Date Joined',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'createdAt',
          label: 'Created At',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'updatedAt',
          label: 'Last Updated',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
      ],
    },
  ],
  
  // Permissions
  permissions: {
    view: true,
    edit: true,
    delete: true,
    navigate: false,
  },
  
  // Styling
  fieldSpacing: 'md',
  borderRadius: 'md',
  shadow: 'sm',
}
