/**
 * Term Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const TermExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'term_number', label: 'Term Number' },
    { key: 'academic_year_name', label: 'Academic Year' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'is_active', label: 'Active', formatter: (v: unknown) => (v as boolean) ? 'Yes' : 'No' },
    { key: 'created_at', label: 'Created At' },
  ],
  options: {
    format: 'csv',
    filename: 'terms',
  },
  showFormatSelector: true,
};
