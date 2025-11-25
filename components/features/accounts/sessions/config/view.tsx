/**
 * UserSession View Configuration
 */

import { ViewField } from '@/components/entityManager/components/view/types';
import { UserSession } from '../../types';

export const sessionViewFields: ViewField<UserSession>[] = [
  {
    key: 'user_full_name',
    label: 'User',
    type: 'text',
    group: 'basic',
  },
  {
    key: 'user_email',
    label: 'Email',
    type: 'email',
    group: 'basic',
  },
  {
    key: 'ip_address',
    label: 'IP Address',
    type: 'text',
    group: 'session',
  },
  {
    key: 'session_key',
    label: 'Session Key',
    type: 'text',
    group: 'session',
  },
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    group: 'status',
  },
  {
    key: 'is_current_session',
    label: 'Current Session',
    type: 'boolean',
    group: 'status',
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
    key: 'last_activity',
    label: 'Last Activity',
    type: 'date',
    group: 'timestamps',
  },
  {
    key: 'created_at',
    label: 'Created',
    type: 'date',
    group: 'timestamps',
  },
  {
    key: 'expires_at',
    label: 'Expires',
    type: 'date',
    group: 'timestamps',
  },
];
