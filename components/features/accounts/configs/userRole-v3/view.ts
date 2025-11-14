import { EntityViewConfig } from '@/components/entityManager/types'
import { UserRoleEntity } from './types'

// ===== USER ROLE VIEW CONFIGURATION =====

export const viewConfig: EntityViewConfig<UserRoleEntity> = {
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
      description: 'Role identification and status',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'name',
          label: 'Role Name',
          type: 'text',
          copyable: true,
        },
        {
          key: 'display_name',
          label: 'Display Name',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          type: 'text',
        },
        {
          key: 'is_active',
          label: 'Status',
          type: 'badge',
          format: (value) => (value ? '✅ Active' : '❌ Inactive'),
        },
      ],
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'Permissions assigned to this role',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'permissions',
          label: 'Assigned Permissions',
          type: 'text',
          format: (value) => {
            if (!value || !Array.isArray(value)) return 'No permissions assigned'
            return value.join(', ')
          },
        },
        {
          key: 'permissions_count',
          label: 'Total Permissions',
          type: 'badge',
          format: (value) => `${value || 0} permissions`,
        },
      ],
    },
    {
      id: 'usage',
      title: 'Usage Statistics',
      description: 'Current usage of this role',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'users_count',
          label: 'Assigned Users',
          type: 'badge',
          format: (value) => `${value || 0} users`,
        },
      ],
    },
    {
      id: 'timestamps',
      title: 'Role Timeline',
      description: 'Role creation and modification timestamps',
      collapsed: true,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'created_at',
          label: 'Created At',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'updated_at',
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
