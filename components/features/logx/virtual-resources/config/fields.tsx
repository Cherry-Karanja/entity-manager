import type { FormField } from "@/components/entityManager/components/form/types";
import { RESOURCE_TYPE_LABELS } from "../../types";
import { authApi } from '@/components/connectionManager/http/client';
import { VirtualResource } from "../../types";

export const virtualResourceFields: FormField<VirtualResource>[] = [
  {
    name: "name",
    label: "Resource Name",
    type: "text",
    required: true,
    placeholder: "e.g., Projector A, Lab Equipment Set",
    helpText: "Name of the virtual resource",
  },
  {
    name: "code",
    label: "Resource Code",
    type: "text",
    required: true,
    placeholder: "e.g., PROJ-001",
    helpText: "Unique identifier code",
  },
  {
    name: "timetable",
    label: "Timetable",
    type: "relation",
    required: true,
    placeholder: "Select timetable",
    helpText: "The timetable this resource is associated with",
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
    name: "resource_type",
    label: "Resource Type",
    type: "select",
    required: true,
    placeholder: "Select resource type",
    helpText: "The category of this virtual resource",
    options: Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "capacity",
    label: "Capacity",
    type: "number",
    placeholder: "e.g., 30",
    helpText: "Maximum capacity or quantity available",
  },
  {
    name: "availability_start",
    label: "Available From",
    type: "time",
    placeholder: "e.g., 08:00",
    helpText: "Daily availability start time",
  },
  {
    name: "availability_end",
    label: "Available Until",
    type: "time",
    placeholder: "e.g., 18:00",
    helpText: "Daily availability end time",
  },
  {
    name: "is_shared",
    label: "Shared Resource",
    type: "checkbox",
    helpText: "Can this resource be shared across multiple schedules?",
  },
  {
    name: "is_active",
    label: "Active",
    type: "checkbox",
    helpText: "Is this resource currently available for scheduling?",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe this virtual resource...",
    helpText: "Additional details about the resource",
  },
];
