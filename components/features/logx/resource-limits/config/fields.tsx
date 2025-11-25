import type { FieldConfig } from "@/components/entityManager";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import type { ResourceLimit } from "../../types";

export const resourceLimitFields: FieldConfig<ResourceLimit>[] = [
  {
    name: "timetable",
    label: "Timetable",
    type: "select",
    required: true,
    placeholder: "Select timetable",
    description: "The timetable this limit applies to",
    fetchOptions: {
      url: "/api/v1/logx/timetabling/timetables/",
      labelField: "name",
      valueField: "id",
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
