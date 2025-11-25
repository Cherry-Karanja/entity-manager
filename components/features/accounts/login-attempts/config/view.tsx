/**
 * LoginAttempt View Configuration
 */

import { ViewField } from '@/components/entityManager/components/view/types';
import { LoginAttempt } from '../../types';

export const loginAttemptViewFields: ViewField<LoginAttempt>[] = [
  {
    name: 'success',
    label: 'Success',
    type: 'boolean',
    group: 'basic',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    group: 'basic',
  },
  {
    name: 'user_full_name',
    label: 'User Name',
    type: 'text',
    group: 'basic',
  },
  {
    name: 'ip_address',
    label: 'IP Address',
    type: 'text',
    group: 'details',
  },
  {
    name: 'user_agent',
    label: 'User Agent',
    type: 'text',
    group: 'details',
  },
  {
    name: 'failure_reason',
    label: 'Failure Reason',
    type: 'text',
    group: 'details',
  },
  {
    name: 'device_type',
    label: 'Device Type',
    type: 'text',
    group: 'device',
  },
  {
    name: 'device_os',
    label: 'Operating System',
    type: 'text',
    group: 'device',
  },
  {
    name: 'browser',
    label: 'Browser',
    type: 'text',
    group: 'device',
  },
  {
    name: 'created_at',
    label: 'Attempted At',
    type: 'datetime',
    group: 'timestamps',
  },
];
