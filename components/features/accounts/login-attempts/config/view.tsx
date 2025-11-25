/**
 * LoginAttempt View Configuration
 */

import { ViewField } from '@/components/entityManager/components/view/types';
import { LoginAttempt } from '../../types';

export const loginAttemptViewFields: ViewField<LoginAttempt>[] = [
  {
    key: 'success',
    label: 'Success',
    type: 'boolean',
    group: 'basic',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    group: 'basic',
  },
  {
    key: 'user_full_name',
    label: 'User Name',
    type: 'text',
    group: 'basic',
  },
  {
    key: 'ip_address',
    label: 'IP Address',
    type: 'text',
    group: 'details',
  },
  {
    key: 'user_agent',
    label: 'User Agent',
    type: 'text',
    group: 'details',
  },
  {
    key: 'failure_reason',
    label: 'Failure Reason',
    type: 'text',
    group: 'details',
  },
  {
    key: 'device_type',
    label: 'Device Type',
    type: 'text',
    group: 'device',
  },
  {
    key: 'device_os',
    label: 'Operating System',
    type: 'text',
    group: 'device',
  },
  {
    key: 'browser',
    label: 'Browser',
    type: 'text',
    group: 'device',
  },
  {
    key: 'created_at',
    label: 'Attempted At',
    type: 'date',
    group: 'timestamps',
  },
];
