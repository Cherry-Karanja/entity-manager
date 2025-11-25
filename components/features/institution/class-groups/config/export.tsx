/**
 * ClassGroup Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const ClassGroupExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Class Name' },
    { key: 'programme_name', label: 'Programme' },
    { key: 'cirriculum_code', label: 'Curriculum', formatter: (v: unknown) => (v as string) || '-' },
    { key: 'intake_name', label: 'Intake', formatter: (v: unknown) => (v as string) || '-' },
    { key: 'year', label: 'Year', formatter: (v: unknown) => String(v || '-') },
    { key: 'term_number', label: 'Term', formatter: (v: unknown) => v ? `Term ${v}` : '-' },
    { key: 'suffix', label: 'Suffix', formatter: (v: unknown) => (v as string) || '-' },
    { key: 'total_trainees', label: 'Trainees', formatter: (v: unknown) => String(v || 0) },
    { key: 'is_active', label: 'Active', formatter: (v: unknown) => (v as boolean) ? 'Yes' : 'No' },
    { key: 'created_at', label: 'Created At' },
  ],
  filename: 'class-groups',
  formats: ['csv', 'json'],
};
