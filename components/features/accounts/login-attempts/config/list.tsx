/**
 * LoginAttempt List Configuration
 */

import { Column } from '@/components/entityManager/components/list/types';
import { LoginAttempt } from '../../types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

export const loginAttemptColumns: Column<LoginAttempt>[] = [
  {
    key: 'success',
    label: 'Result',
    sortable: true,
    render: (_value, entity) => (
      <div className="flex items-center gap-2">
        {entity.success ? (
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
    key: 'email',
    label: 'Email',
    sortable: true,
    filterable: true,
    render: (_value, entity) => (
      <div>
        <div className="font-medium">{entity.email}</div>
        {entity.user_full_name && (
          <div className="text-xs text-muted-foreground">{entity.user_full_name}</div>
        )}
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
    key: 'failure_reason',
    label: 'Reason',
    render: (_value, entity) => (
      entity.failure_reason ? (
        <span className="text-sm text-red-600">{entity.failure_reason}</span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    ),
  },
  {
    key: 'created_at',
    label: 'Attempted',
    sortable: true,
    type: 'date',
    render: (_value, entity) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(entity.created_at), { addSuffix: true })}
      </span>
    ),
  },
];
