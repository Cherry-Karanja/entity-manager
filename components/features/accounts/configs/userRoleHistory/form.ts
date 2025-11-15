// ===== USER ROLE HISTORY FORM CONFIGURATION =====

import { EntityFormConfig } from '@/components/entityManager/EntityForm/types';

export const userRoleHistoryFormConfig: EntityFormConfig = {
  fields: [
    {
      name: 'user',
      label: 'User',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      name: 'role',
      label: 'Role',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      name: 'changed_by',
      label: 'Changed By',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      name: 'change_reason',
      label: 'Change Reason',
      type: 'textarea',
      disabled: true
    },
    {
      name: 'created_at',
      label: 'Changed At',
      type: 'datetime',
      disabled: true
    }
  ]
};