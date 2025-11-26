/**
 * Programme Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const ProgrammeExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Programme Name' },
    { key: 'code', label: 'Code', formatter: (v: unknown) => (v as string) || '-' },
    { key: 'level', label: 'Level' },
    { key: 'department_name', label: 'Department' },
    { key: 'total_class_groups', label: 'Classes', formatter: (v: unknown) => String(v || 0) },
    { key: 'total_trainees', label: 'Trainees', formatter: (v: unknown) => String(v || 0) },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ],
  options: {
    format: 'csv',
    filename: 'programmes',
  },
  showFormatSelector: true,
};
