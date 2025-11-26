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
    width: '20%',
    render: (_value, session) => (
      <div>
        <div className="font-medium">{session?.user_full_name}</div>
        <div className="text-xs text-muted-foreground">{session?.user_email}</div>
      </div>
    ),
  },
  {
    key: 'ip_address',
    label: 'IP Address',
    sortable: true,
    width: '15%',
    type: 'text',
  },
  {
    key: 'device_type',
    label: 'Device',
    sortable: true,
    width: '20%',
    render: (_value, session) => (
      <div>
        <div className="text-sm">{session?.device_type || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">
          {session?.browser} • {session?.device_os}
        </div>
      </div>
    ),
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    filterable: true,
    width: '10%',
    type: 'boolean',
    render: (_value, session) => (
      <Badge variant={session?.is_active ? 'default' : 'secondary'}>
        {session?.is_active ? 'Active' : 'Expired'}
      </Badge>
    ),
  },
  {
    key: 'last_activity',
    label: 'Last Activity',
    sortable: true,
    width: '15%',
    type: 'date',
    render: (_value, session) => (
      <span className="text-sm">
        {session?.last_activity ? formatDistanceToNow(new Date(session.last_activity), { addSuffix: true }) : '-'}
      </span>
    ),
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    width: '15%',
    type: 'date',
    render: (_value, session) => (
      <span className="text-sm">
        {session?.created_at ? formatDistanceToNow(new Date(session.created_at), { addSuffix: true }) : '-'}
      </span>
    ),
  },
];
