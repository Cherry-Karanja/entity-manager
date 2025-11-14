import { FormField } from '@/components/entityManager/types'

// ===== FIELD DEFINITIONS (Single Source of Truth) =====
// All field definitions for UserRoleHistory entity in one place

export const userRoleHistoryFields: FormField[] = [
  {
    name: 'id',
    label: 'History ID',
    type: 'text',
    required: false,
    readOnly: true,
    helpText: 'Unique identifier for the role change history entry',
  },
  {
    name: 'user',
    label: 'User',
    type: 'text',
    required: true,
    readOnly: true,
    helpText: 'User whose role was changed',
  },
  {
    name: 'old_role',
    label: 'Previous Role',
    type: 'text',
    required: false,
    readOnly: true,
    helpText: 'Role before the change (empty for new assignments)',
  },
  {
    name: 'new_role',
    label: 'New Role',
    type: 'text',
    required: false,
    readOnly: true,
    helpText: 'Role after the change (empty for role removals)',
  },
  {
    name: 'changed_by',
    label: 'Changed By',
    type: 'text',
    required: false,
    readOnly: true,
    helpText: 'User who made the role change',
  },
  {
    name: 'reason',
    label: 'Change Reason',
    type: 'textarea',
    required: true,
    readOnly: true,
    validation: {
      required: 'Reason is required',
      minLength: 5,
      maxLength: 500,
    },
    helpText: 'Reason for the role change',
  },
  {
    name: 'created_at',
    label: 'Change Date',
    type: 'date',
    required: true,
    readOnly: true,
    helpText: 'When the role change occurred',
  },
]
