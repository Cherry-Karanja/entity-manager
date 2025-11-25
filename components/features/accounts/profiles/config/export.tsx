/**
 * UserProfile Export Configuration
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { UserProfile } from '../types';

export const UserProfileExporterConfig: EntityExporterConfig<UserProfile> = {
  fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'user_name',
      label: 'User Name',
    },
    {
      key: 'user_email',
      label: 'Email',
    },
    {
      key: 'bio',
      label: 'Biography',
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'job_title',
      label: 'Job Title',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'preferred_language',
      label: 'Preferred Language',
    },
    {
      key: 'interface_theme',
      label: 'Theme',
    },
    {
      key: 'created_at',
      label: 'Created At',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
  ],
  options: {
    format: 'xlsx',
    filename: 'profiles_export',
    includeHeaders: true,
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
  },
};
