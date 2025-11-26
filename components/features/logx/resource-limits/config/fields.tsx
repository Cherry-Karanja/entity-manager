/**
 * Resource Limit Field Configurations
 * 
 * Defines all form fields for resource limit management.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { FormField } from '@/components/entityManager/components/form/types';
import { authApi } from '@/components/connectionManager/http/client';
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { ResourceLimit } from "../../types";

export const resourceLimitFields: FormField<ResourceLimit>[] = [
  {
    name: "timetable",
    label: "Timetable",
    type: "relation",
    required: true,
    placeholder: "Select timetable",
    group: 'basic',
    relationConfig: {
      entity: "timetables",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/timetabling/timetables/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
    helpText: 'The timetable this limit applies to',
    width: '50%',
  },
  {
    name: "entity_type",
    label: "Entity Type",
    type: "select",
    required: true,
    placeholder: "Select entity type",
    group: 'basic',
    options: Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    helpText: 'The type of entity this limit applies to',
    width: '50%',
  },
  {
    name: "resource_type",
    label: "Resource Type",
    type: "select",
    required: true,
    placeholder: "Select resource type",
    group: 'limit',
    options: Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    helpText: 'The type of resource being limited',
    width: '33%',
  },
  {
    name: "max_limit",
    label: "Maximum Value",
    type: "number",
    required: true,
    placeholder: "Enter maximum value",
    group: 'limit',
    helpText: 'The maximum allowed value for this limit',
    width: '33%',
  },
  {
    name: "period_type",
    label: "Period Type",
    type: "select",
    required: true,
    placeholder: "Select period type",
    group: 'limit',
    options: Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    helpText: 'The time period for this limit',
    width: '33%',
  },
  {
    name: "is_active",
    label: "Active",
    type: "switch",
    required: false,
    group: 'status',
    helpText: 'Whether this limit is currently active',
    width: '50%',
  },
];

export const ResourceLimitFormConfig: EntityFormConfig<ResourceLimit> = {
  fields: resourceLimitFields,
  layout: 'tabs',
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Timetable and entity information',
      fields: ['timetable', 'entity_type'],
      order: 1,
    },
    {
      id: 'limit',
      label: 'Limit Configuration',
      description: 'Resource limits and period settings',
      fields: ['resource_type', 'max_limit', 'period_type'],
      order: 2,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Active status',
      fields: ['is_active'],
      order: 3,
    },
  ],
  submitText: 'Save Resource Limit',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,
};
