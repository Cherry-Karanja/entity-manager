// ===== USER ROLE HISTORY FIELD CONFIGURATIONS =====

import { EntityField } from '@/components/entityManager/manager/types'
import { UserRoleHistory, UserRoleHistoryFormData } from '../../types'

// ===== FIELD DEFINITIONS =====

export const userRoleHistoryFields: EntityField<UserRoleHistory, UserRoleHistoryFormData>[] = [
  // ===== BASIC INFORMATION =====
  {
    key: 'id',
    label: 'History ID',
    type: 'string',
    required: false,
    readOnly: true,
    description: 'Unique identifier for the role change history entry'
  },
  {
    key: 'user',
    label: 'User',
    type: 'string',
    required: true,
    readOnly: false,
    description: 'User whose role was changed'
  },
  {
    key: 'old_role',
    label: 'Previous Role',
    type: 'string',
    required: false,
    readOnly: false,
    description: 'Role before the change (empty for new assignments)'
  },
  {
    key: 'new_role',
    label: 'New Role',
    type: 'string',
    required: false,
    readOnly: false,
    description: 'Role after the change (empty for role removals)'
  },
  {
    key: 'changed_by',
    label: 'Changed By',
    type: 'string',
    required: false,
    readOnly: false,
    description: 'User who made the role change'
  },

  // ===== CHANGE DETAILS =====
  {
    key: 'reason',
    label: 'Change Reason',
    type: 'string',
    required: true,
    readOnly: false,
    description: 'Reason for the role change',
    minLength: 5,
    maxLength: 500
  },

  // ===== TIMESTAMPS =====
  {
    key: 'created_at',
    label: 'Change Date',
    type: 'date',
    required: true,
    readOnly: false,
    description: 'When the role change occurred'
  }
]