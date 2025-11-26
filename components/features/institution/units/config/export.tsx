/**
 * Unit Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const UnitExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'programme_name', label: 'Programme' },
    { key: 'credits', label: 'Credits' },
    { key: 'level', label: 'Level' },
    { key: 'term_number', label: 'Term' },
    { key: 'is_core', label: 'Core Unit', formatter: (v: unknown) => (v as boolean) ? 'Yes' : 'No' },
    { key: 'is_active', label: 'Active', formatter: (v: unknown) => (v as boolean) ? 'Yes' : 'No' },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Created At' },
  ],
  options: {
    format: 'csv',
    filename: 'units',
  },
  showFormatSelector: true,
};
