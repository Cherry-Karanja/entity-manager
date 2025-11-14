import { EntityViewConfig } from '@/components/entityManager/types'
import { UserRoleHistoryEntity } from './types'

// ===== USER ROLE HISTORY VIEW CONFIGURATION =====

export const viewConfig: EntityViewConfig<UserRoleHistoryEntity> = {
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
      id: 'change-details',
      title: 'Role Change Information',
      description: 'Details about the role change event',
      collapsed: false,
      collapsible: false,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'user',
          label: 'User',
          type: 'text',
          format: (value) => `👤 ${value}`,
        },
        {
          key: 'changed_by',
          label: 'Changed By',
          type: 'text',
          format: (value) => (value ? String(value) : '🤖 System'),
        },
        {
          key: 'old_role',
          label: 'Previous Role',
          type: 'badge',
          format: (value) => (value ? String(value) : '➖ None'),
        },
        {
          key: 'new_role',
          label: 'New Role',
          type: 'badge',
          format: (value) => (value ? `✨ ${value}` : '➖ None'),
        },
      ],
    },
    {
      id: 'change-reason',
      title: 'Change Details',
      description: 'Reason and context for the role change',
      collapsed: false,
      collapsible: false,
      layout: 'vertical',
      fields: [
        {
          key: 'reason',
          label: 'Reason for Change',
          type: 'text',
        },
      ],
    },
    {
      id: 'audit-info',
      title: 'Audit Information',
      description: 'When the change occurred and audit trail',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'created_at',
          label: 'Change Date & Time',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'id',
          label: 'Record ID',
          type: 'text',
          copyable: true,
        },
      ],
    },
  ],
  
  // Permissions
  permissions: {
    view: true,
    edit: false,    // Read-only
    delete: false,  // Read-only
    navigate: false,
  },
  
  // Styling
  fieldSpacing: 'md',
  borderRadius: 'md',
  shadow: 'sm',
}
