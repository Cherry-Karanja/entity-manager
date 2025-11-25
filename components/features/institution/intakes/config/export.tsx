/**
 * Intake Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const IntakeExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'academic_year_name', label: 'Academic Year' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'is_active', label: 'Active', formatter: (v: unknown) => (v as boolean) ? 'Yes' : 'No' },
    { key: 'created_at', label: 'Created At' },
  ],
  filename: 'intakes',
  formats: ['csv', 'json'],
};
