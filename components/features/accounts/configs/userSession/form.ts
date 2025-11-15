// ===== USER SESSION FORM CONFIGURATION =====

import { EntityFormConfig } from '@/components/entityManager/EntityForm/types';

export const userSessionFormConfig: EntityFormConfig = {
  fields: [
    {
      name: 'user',
      label: 'User',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      name: 'session_key',
      label: 'Session Key',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      name: 'ip_address',
      label: 'IP Address',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      name: 'user_agent',
      label: 'User Agent',
      type: 'textarea',
      disabled: true
    },
    {
      name: 'device_type',
      label: 'Device Type',
      type: 'text',
      disabled: true
    },
    {
      name: 'browser',
      label: 'Browser',
      type: 'text',
      disabled: true
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      disabled: true
    },
    {
      name: 'is_active',
      label: 'Is Active',
      type: 'checkbox',
      disabled: true
    },
    {
      name: 'created_at',
      label: 'Created At',
      type: 'datetime',
      disabled: true
    },
    {
      name: 'last_activity',
      label: 'Last Activity',
      type: 'datetime',
      disabled: true
    },
    {
      name: 'expires_at',
      label: 'Expires At',
      type: 'datetime',
      disabled: true
    }
  ]
};