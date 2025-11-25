/**
 * UserRole Export Configuration
 * 
 * Defines export fields and options for role data export.
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';

export const UserRoleExporterConfig: EntityExporterConfig = {
  fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Role Name',
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
      key: 'users_count',
      label: 'Users Count',
    },
    {
      key: 'created_at',
      label: 'Created At',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
  ],

  options: {
    format: 'xlsx',
    filename: 'roles_export',
    includeHeaders: true,
    // for json
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
    // for csv
    delimiter: ',',
    // for xlsx
    sheetName: 'Roles',
  },

  buttonLabel: 'Export Roles',
  showFormatSelector: true,
  showFieldSelector: true,
  className: 'btn btn-primary',
  disabled: false,
};
