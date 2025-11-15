// ===== LOGIN ATTEMPT FORM CONFIGURATION =====

import { EntityFormConfig } from '@/components/entityManager/EntityForm/types';

export const loginAttemptFormConfig: EntityFormConfig = {
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
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
      name: 'user_agent',
      label: 'User Agent',
      type: 'textarea',
      disabled: true
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      disabled: true
    },
    {
      name: 'successful',
      label: 'Successful',
      type: 'checkbox',
      disabled: true
    },
    {
      name: 'created_at',
      label: 'Created At',
      type: 'datetime',
      disabled: true
    }
  ]
};