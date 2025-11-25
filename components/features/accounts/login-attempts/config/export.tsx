/**
 * LoginAttempt Export Configuration
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { LoginAttempt } from '../../types';

export const LoginAttemptExporterConfig: EntityExporterConfig<LoginAttempt> = {
  fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'user_full_name',
      label: 'User Name',
    },
    {
      key: 'success',
      label: 'Success',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'failure_reason',
      label: 'Failure Reason',
    },
    {
      key: 'ip_address',
      label: 'IP Address',
    },
    {
      key: 'device_type',
      label: 'Device Type',
    },
    {
      key: 'device_os',
      label: 'Operating System',
    },
    {
      key: 'browser',
      label: 'Browser',
    },
    {
      key: 'created_at',
      label: 'Attempted At',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
  ],
  options: {
    format: 'xlsx',
    filename: 'login_attempts_export',
    includeHeaders: true,
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
  },
};
