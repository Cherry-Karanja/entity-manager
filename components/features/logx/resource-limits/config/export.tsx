/**
 * Resource Limit Exporter Configuration
 * 
 * Defines export fields and options for resource limits.
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";

export const ResourceLimitExporterConfig: EntityExporterConfig<ResourceLimit> = {
  fields: [
    { key: 'id', label: 'ID' },
    {
      key: 'timetable_name',
      label: 'Timetable',
    },
    {
      key: 'entity_type',
      label: 'Entity Type',
      formatter: (value: unknown) =>
        String(ENTITY_TYPE_LABELS[value as keyof typeof ENTITY_TYPE_LABELS] || value || ''),
    },
    {
      key: 'resource_type',
      label: 'Resource Type',
      formatter: (value: unknown) =>
        String(RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value || ''),
    },
    { key: 'max_limit', label: 'Maximum Limit' },
    { key: 'current_usage', label: 'Current Usage' },
    {
      key: 'period_type',
      label: 'Period Type',
      formatter: (value: unknown) =>
        String(PERIOD_TYPE_LABELS[value as keyof typeof PERIOD_TYPE_LABELS] || value || ''),
    },
    { 
      key: 'is_active', 
      label: 'Status', 
      formatter: (value: unknown) => ((value as boolean) ? 'Active' : 'Inactive'),
    },
    { 
      key: 'created_at', 
      label: 'Created At', 
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : '-',
    },
    { 
      key: 'updated_at', 
      label: 'Updated At', 
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : '-',
    },
  ],

  options: {
    format: 'xlsx',
    filename: 'resource_limits_export',
    includeHeaders: true,
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
    delimiter: ',',
    sheetName: 'Resource Limits',
  },

  buttonLabel: 'Export Resource Limits',
  showFormatSelector: true,
  showFieldSelector: true,
  className: 'btn btn-primary',
  disabled: false,
};
