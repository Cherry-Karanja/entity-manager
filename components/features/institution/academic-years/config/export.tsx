/**
 * Academic Year Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const AcademicYearExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'year', label: 'Year' },
    { key: 'is_active', label: 'Active', formatter: (v: unknown) => (v as boolean) ? 'Yes' : 'No' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ],
  options: {
    format: 'csv',
    filename: 'academic-years',
  },
  showFormatSelector: true,
};
