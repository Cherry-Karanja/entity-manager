import type { FormField } from "@/components/entityManager/components/form/types";
import { DAY_OF_WEEK_LABELS } from "../../types";
import { authApi } from '@/components/connectionManager/http/client';

export const classGroupScheduleFields: FormField[] = [
  {
    name: "timetable",
    label: "Timetable",
    type: "relation",
    required: true,
    placeholder: "Select timetable",
    helpText: "The timetable this schedule belongs to",
    relationConfig: {
      entity: "timetables",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/logx/timetabling/timetables/', params as any);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "class_group",
    label: "Class Group",
    type: "relation",
    required: true,
    placeholder: "Select class group",
    helpText: "The class group for this schedule",
    relationConfig: {
      entity: "class-groups",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/class-groups/', params as any);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "unit",
    label: "Unit",
    type: "relation",
    required: true,
    placeholder: "Select unit",
    helpText: "The subject/unit being taught",
    relationConfig: {
      entity: "units",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/academics/units/', params as any);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "instructor",
    label: "Instructor",
    type: "relation",
    required: true,
    placeholder: "Select instructor",
    helpText: "The teacher/instructor for this class",
    relationConfig: {
      entity: "staff",
      displayField: "full_name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/accounts/staff/', params as any);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "room",
    label: "Room",
    type: "relation",
    required: true,
    placeholder: "Select room",
    helpText: "The room where the class will be held",
    relationConfig: {
      entity: "rooms",
      displayField: "name",
      valueField: "id",
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/logx/resources/rooms/', params as any);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
    },
  },
  {
    name: "day_of_week",
    label: "Day of Week",
    type: "select",
    required: true,
    placeholder: "Select day",
    helpText: "The day of the week for this class",
    options: Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
      value: parseInt(value),
      label,
    })),
  },
  {
    name: "start_time",
    label: "Start Time",
    type: "time",
    required: true,
    placeholder: "e.g., 08:00",
    helpText: "Class start time",
  },
  {
    name: "end_time",
    label: "End Time",
    type: "time",
    required: true,
    placeholder: "e.g., 09:00",
    helpText: "Class end time",
  },
  {
    name: "is_locked",
    label: "Lock Schedule",
    type: "checkbox",
    helpText: "Prevent this schedule from being modified by the timetable generator",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Additional notes about this schedule...",
    helpText: "Any additional information or special instructions",
  },
];
