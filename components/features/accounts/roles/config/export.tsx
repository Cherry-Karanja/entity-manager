/**
 * UserRole Export Configuration
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';

export const UserRoleExporterConfig: EntityExporterConfig<UserRole> = {
  fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'display_name',
      label: 'Display Name',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'is_active',
      label: 'Active',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_system',
      label: 'System Role',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'users_count',
      label: 'Users Count',
    },
    {
      key: 'created_at',
      label: 'Created At',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
  ],
  options: {
    format: 'xlsx',
    filename: 'roles_export',
    includeHeaders: true,
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
  },
};
