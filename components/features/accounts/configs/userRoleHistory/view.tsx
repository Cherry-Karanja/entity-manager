// ===== USER ROLE HISTORY VIEW CONFIGURATION =====

import { EntityViewConfig } from '@/components/entityManager/EntityView/types'
import { UserRoleHistory } from '../../types'

// ===== VIEW CONFIGURATION =====

export const userRoleHistoryViewConfig: EntityViewConfig = {
  mode: 'detail',
  layout: 'single',
  showHeader: true,
  showActions: true,
  showMetadata: true,

  fieldGroups: [
    // ===== CHANGE DETAILS =====
    {
      id: 'change_details',
      title: 'Role Change Information',
      description: 'Details about the role change event',
      fields: [
        {
          key: 'user',
          label: 'User',
          type: 'text'
        },
        {
          key: 'old_role',
          label: 'Previous Role',
          type: 'text',
          format: (value) => String(value || 'None')
        },
        {
          key: 'new_role',
          label: 'New Role',
          type: 'text',
          format: (value) => String(value || 'None')
        },
        {
          key: 'changed_by',
          label: 'Changed By',
          type: 'text',
          format: (value) => String(value || 'System')
        }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: false
    },

    // ===== CHANGE REASON =====
    {
      id: 'change_reason',
      title: 'Change Details',
      description: 'Reason and context for the role change',
      fields: [
        {
          key: 'reason',
          label: 'Reason for Change',
          type: 'text'
        }
      ],
      layout: 'vertical',
      collapsible: false
    },

    // ===== TIMESTAMPS =====
    {
      id: 'audit_info',
      title: 'Audit Information',
      description: 'When the change occurred and audit trail',
      fields: [
        {
          key: 'created_at',
          label: 'Change Date & Time',
          type: 'datetime'
        }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    }
  ],

  // ===== VIEW SETTINGS =====
  compact: false
}