/**
 * Department Export Configuration
 * 
 * Defines export fields for department data.
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const DepartmentExporterConfig: EntityExporterConfig = {
  fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Department Name',
    },
    {
      key: 'hod_name',
      label: 'Head of Department',
      formatter: (value: unknown) => (value as string) || 'Not Assigned',
    },
    {
      key: 'hod_email',
      label: 'HOD Email',
      formatter: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'total_programmes',
      label: 'Programmes',
      formatter: (value: unknown) => String(value || 0),
    },
    {
      key: 'total_class_groups',
      label: 'Classes',
      formatter: (value: unknown) => String(value || 0),
    },
    {
      key: 'total_trainers',
      label: 'Trainers',
      formatter: (value: unknown) => String(value || 0),
    },
    {
      key: 'total_trainees',
      label: 'Trainees',
      formatter: (value: unknown) => String(value || 0),
    },
    {
      key: 'created_at',
      label: 'Created At',
    },
    {
      key: 'updated_at',
      label: 'Updated At',
    },
  ],
  options: {
    format: 'csv',
    filename: 'departments',
  },
  showFormatSelector: true,
};
