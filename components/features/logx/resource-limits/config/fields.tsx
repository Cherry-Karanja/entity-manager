import type { FormField } from "@/components/entityManager";
import { authApi } from '@/components/connectionManager/http/client';
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import type { ResourceLimit } from "../../types";

export const resourceLimitFields: FormField<ResourceLimit>[] = [
  {
    name: "timetable",
    label: "Timetable",
    type: "select",
    required: true,
    placeholder: "Select timetable",
    description: "The timetable this limit applies to",
    relationConfig: {
      entity: "timetables",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/logx/timetabling/timetables/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "entity_type",
    label: "Entity Type",
    type: "select",
    required: true,
    placeholder: "Select entity type",
    description: "The type of entity this limit applies to",
    options: Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "resource_type",
    label: "Resource Type",
    type: "select",
    required: true,
    placeholder: "Select resource type",
    description: "The type of resource being limited",
    options: Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "max_value",
    label: "Maximum Value",
    type: "number",
    required: true,
    placeholder: "Enter maximum value",
    description: "The maximum allowed value for this limit",
  },
  {
    name: "period_type",
    label: "Period Type",
    type: "select",
    required: true,
    placeholder: "Select period type",
    description: "The time period for this limit",
    options: Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "is_active",
    label: "Active",
    type: "checkbox",
    required: false,
    description: "Whether this limit is currently active",
  },
];

export default resourceLimitFields;
