import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import type { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";

export const resourceLimitExportConfig: EntityExporterConfig<ResourceLimit> = {
  fields: [
    { key: 'id', label: 'ID' },
    {
      key: 'timetable_details',
      label: 'Timetable',
      formatter: (value: unknown) => {
        if (value && typeof value === 'object' && 'name' in (value as any)) {
          return (value as any).name;
        }
        return '-';
      },
    },
    {
      key: 'entity_type',
      label: 'Entity Type',
      formatter: (value: unknown) =>
        ENTITY_TYPE_LABELS[value as keyof typeof ENTITY_TYPE_LABELS] || value,
    },
    {
      key: 'resource_type',
      label: 'Resource Type',
      formatter: (value: unknown) =>
        RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value,
    },
    { key: 'max_value', label: 'Maximum Value' },
    {
      key: 'period_type',
      label: 'Period Type',
      formatter: (value: unknown) =>
        PERIOD_TYPE_LABELS[value as keyof typeof PERIOD_TYPE_LABELS] || value,
    },
    { key: 'is_active', label: 'Status', formatter: (value: unknown) => ((value as boolean) ? 'Active' : 'Inactive') },
    { key: 'created_at', label: 'Created At', formatter: (value: unknown) => (value ? new Date(value as string).toLocaleString() : '-') },
    { key: 'updated_at', label: 'Updated At', formatter: (value: unknown) => (value ? new Date(value as string).toLocaleString() : '-') },
  ],
  options: { format: 'csv', filename: 'resource-limits', includeHeaders: true },
  // defaultColumns is a feature-specific hint for UI; keep as metadata
  // @ts-ignore
  defaultColumns: [
    'timetable_details',
    'entity_type',
    'resource_type',
    'max_value',
    'period_type',
    'is_active',
  ],
};

export default resourceLimitExportConfig;
