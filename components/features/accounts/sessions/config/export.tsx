/**
 * UserSession Export Configuration
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { UserSession } from '../../types';

export const UserSessionExporterConfig: EntityExporterConfig<UserSession> = {
  fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'user_email',
      label: 'User Email',
    },
    {
      key: 'user_full_name',
      label: 'User Name',
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
      key: 'is_active',
      label: 'Active',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'created_at',
      label: 'Created At',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
    {
      key: 'expires_at',
      label: 'Expires At',
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : '-',
    },
  ],
  options: {
    format: 'xlsx',
    filename: 'sessions_export',
    includeHeaders: true,
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
  },
};
