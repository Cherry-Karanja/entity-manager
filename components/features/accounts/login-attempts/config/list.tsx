/**
 * LoginAttempt List Configuration
 */

import { ColumnDef } from '@tanstack/react-table';
import { LoginAttempt } from '../../types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

export const loginAttemptColumns: ColumnDef<LoginAttempt>[] = [
  {
    accessorKey: 'success',
    header: 'Result',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.success ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <Badge variant="default" className="bg-green-500">Success</Badge>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-500" />
            <Badge variant="destructive">Failed</Badge>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.email}</div>
        {row.original.user_full_name && (
          <div className="text-xs text-muted-foreground">{row.original.user_full_name}</div>
        )}
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
    accessorKey: 'failure_reason',
    header: 'Reason',
    cell: ({ row }) => (
      row.original.failure_reason ? (
        <span className="text-sm text-red-600">{row.original.failure_reason}</span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Attempted',
    cell: ({ row }) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
      </span>
    ),
  },
];
