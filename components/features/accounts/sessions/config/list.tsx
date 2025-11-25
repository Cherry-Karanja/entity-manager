/**
 * UserSession List Configuration
 */

import { Column } from '@/components/entityManager/components/list/types';
import { UserSession } from '../../types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const sessionColumns: Column<UserSession>[] = [
  {
    key: 'user_email',
    label: 'User',
    sortable: true,
    filterable: true,
    render: (_value, entity) => (
      <div>
        <div className="font-medium">{entity.user_full_name}</div>
        <div className="text-xs text-muted-foreground">{entity.user_email}</div>
      </div>
    ),
  },
  {
    key: 'ip_address',
    label: 'IP Address',
    sortable: true,
  },
  {
    key: 'device_type',
    label: 'Device',
    render: (_value, entity) => (
      <div>
        <div className="text-sm">{entity.device_type || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">
          {entity.browser} • {entity.device_os}
        </div>
      </div>
    ),
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    type: 'boolean',
    render: (_value, entity) => (
      <Badge variant={entity.is_active ? 'default' : 'secondary'}>
        {entity.is_active ? 'Active' : 'Expired'}
      </Badge>
    ),
  },
  {
    key: 'last_activity',
    label: 'Last Activity',
    sortable: true,
    type: 'date',
    render: (_value, entity) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(entity.last_activity), { addSuffix: true })}
      </span>
    ),
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    type: 'date',
    render: (_value, entity) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(entity.created_at), { addSuffix: true })}
      </span>
    ),
  },
];
