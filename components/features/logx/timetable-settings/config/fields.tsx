import { FormField } from '@/components/entityManager/components/form/types';
import { authApi } from '@/components/connectionManager/http/client';

export const timetableSettingsFields: FormField<any>[] = [
  {
    name: "name",
    label: "Settings Name",
    type: "text",
    required: true,
    placeholder: "e.g., Default Settings",
    helpText: "A unique name for this settings configuration",
  },
  {
    name: "institution",
    label: "Institution",
    type: "select",
    required: true,
    placeholder: "Select institution",
    helpText: "The institution these settings apply to",
    relationConfig: {
      entity: 'institutions',
      displayField: 'name',
      valueField: 'id',
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/institutions/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
      searchFields: ['name'],
    },
  },
  {
    name: "max_lessons_per_day",
    label: "Max Lessons Per Day",
    type: "number",
    required: true,
    placeholder: "e.g., 8",
    helpText: "Maximum number of lessons a class can have per day",
  },
  {
    name: "max_consecutive_lessons",
    label: "Max Consecutive Lessons",
    type: "number",
    required: true,
    placeholder: "e.g., 3",
    helpText: "Maximum number of consecutive lessons without a break",
  },
  {
    name: "min_break_duration",
    label: "Min Break Duration (minutes)",
    type: "number",
    required: true,
    placeholder: "e.g., 15",
    helpText: "Minimum break duration between lesson blocks",
  },
  {
    name: "allow_split_lessons",
    label: "Allow Split Lessons",
    type: "checkbox",
    helpText: "Allow lessons to be split across non-consecutive periods",
  },
  {
    name: "prefer_morning_classes",
    label: "Prefer Morning Classes",
    type: "checkbox",
    helpText: "Schedule classes in the morning when possible",
  },
  {
    name: "balance_daily_load",
    label: "Balance Daily Load",
    type: "checkbox",
    helpText: "Distribute lessons evenly across days",
  },
  {
    name: "avoid_gaps",
    label: "Avoid Gaps",
    type: "checkbox",
    helpText: "Minimize free periods between lessons",
  },
  {
    name: "respect_room_capacity",
    label: "Respect Room Capacity",
    type: "checkbox",
    helpText: "Only assign rooms that can accommodate the class size",
  },
  {
    name: "algorithm_timeout",
    label: "Algorithm Timeout (seconds)",
    type: "number",
    placeholder: "e.g., 300",
    helpText: "Maximum time for the scheduling algorithm to run",
  },
  {
    name: "optimization_iterations",
    label: "Optimization Iterations",
    type: "number",
    placeholder: "e.g., 1000",
    helpText: "Number of iterations for optimization",
  },
  {
    name: "is_default",
    label: "Default Settings",
    type: "checkbox",
    helpText: "Use as default settings for new timetables",
  },
];
