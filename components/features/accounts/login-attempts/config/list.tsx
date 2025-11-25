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
    render: (value, attempt) => (
      <div className="flex items-center gap-2">
        {attempt.success ? (
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
    render: (value, attempt) => (
      <div>
        <div className="font-medium">{attempt.email}</div>
        {attempt.user_full_name && (
          <div className="text-xs text-muted-foreground">{attempt.user_full_name}</div>
        )}
      </div>
    ),
  },
  {
    key: 'ip_address',
    label: 'IP Address',
  },
  {
    key: 'device_type',
    label: 'Device',
    render: (value, attempt) => (
      <div>
        <div className="text-sm">{attempt.device_type || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">
          {attempt.browser} • {attempt.device_os}
        </div>
      </div>
    ),
  },
  {
    key: 'failure_reason',
    label: 'Reason',
    render: (value, attempt) => (
      attempt.failure_reason ? (
        <span className="text-sm text-red-600">{attempt.failure_reason}</span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    ),
  },
  {
    key: 'created_at',
    label: 'Attempted',
    render: (value, attempt) => (
      <span className="text-sm">
        {formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true })}
      </span>
    ),
  },
];
