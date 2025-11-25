/**
 * UserSession View Configuration
 */

import { ViewField } from '@/components/entityManager/components/view/types';
import { UserSession } from '../../types';

export const sessionViewFields: ViewField<UserSession>[] = [
  {
    name: 'user_full_name',
    label: 'User',
    type: 'text',
    group: 'basic',
  },
  {
    name: 'user_email',
    label: 'Email',
    type: 'email',
    group: 'basic',
  },
  {
    name: 'ip_address',
    label: 'IP Address',
    type: 'text',
    group: 'session',
  },
  {
    name: 'session_key',
    label: 'Session Key',
    type: 'text',
    group: 'session',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'boolean',
    group: 'status',
  },
  {
    name: 'is_current_session',
    label: 'Current Session',
    type: 'boolean',
    group: 'status',
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
    name: 'last_activity',
    label: 'Last Activity',
    type: 'datetime',
    group: 'timestamps',
  },
  {
    name: 'created_at',
    label: 'Created',
    type: 'datetime',
    group: 'timestamps',
  },
  {
    name: 'expires_at',
    label: 'Expires',
    type: 'datetime',
    group: 'timestamps',
  },
];
