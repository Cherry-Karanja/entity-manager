/**
 * UserSession List Configuration
 */

import { ColumnDef } from '@tanstack/react-table';
import { UserSession } from '../../types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const sessionColumns: ColumnDef<UserSession>[] = [
  {
    accessorKey: 'user_email',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user_full_name}</div>
        <div className="text-xs text-muted-foreground">{row.original.user_email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'ip_address',
    header: 'IP Address',
  },
  {
    accessorKey: 'device_type',
    header: 'Device',
    cell: ({ row }) => (
      <div>
        <div className="text-sm">{row.original.device_type || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.browser} • {row.original.device_os}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
        {row.original.is_active ? 'Active' : 'Expired'}
      </Badge>
    ),
  },
  {
    accessorKey: 'last_activity',
    header: 'Last Activity',
    cell: ({ row }) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(row.original.last_activity), { addSuffix: true })}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
      </span>
    ),
  },
];
