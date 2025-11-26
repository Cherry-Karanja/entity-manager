import type { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { TimetableSettings } from "../../types";

export const timetableSettingsViewConfig: EntityViewConfig<TimetableSettings> = {
  fields: [],
  title: (item) => item?.name || "Timetable Settings",
  subtitle: (item) => (item?.is_default ? "Default Settings" : "Custom Settings"),
  sections: [
    {
      id: 'basic-information',
      label: "Basic Information",
      fields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "institution_name",
          label: "Institution",
        },
        {
          key: "is_default",
          label: "Default Settings",
          render: (value: any) => (value ? "Yes" : "No"),
        },
      ],
    },
    {
      id: 'lesson-constraints',
      label: "Lesson Constraints",
      fields: [
        {
          key: "max_lessons_per_day",
          label: "Max Lessons Per Day",
        },
        {
          key: "max_consecutive_lessons",
          label: "Max Consecutive Lessons",
        },
        {
          key: "min_break_duration",
          label: "Minimum Break Duration",
          render: (value: any) => (value ? `${value} minutes` : "—"),
        },
        {
          key: "allow_split_lessons",
          label: "Allow Split Lessons",
          render: (value: any) => (value ? "Yes" : "No"),
        },
      ],
    },
    {
      id: 'scheduling-preferences',
      label: "Scheduling Preferences",
      fields: [
        {
          key: "prefer_morning_classes",
          label: "Prefer Morning Classes",
          render: (value: any) => (value ? "Yes" : "No"),
        },
        {
          key: "balance_daily_load",
          label: "Balance Daily Load",
          render: (value: any) => (value ? "Yes" : "No"),
        },
        {
          key: "avoid_gaps",
          label: "Avoid Gaps",
          render: (value) => (value ? "Yes" : "No"),
        },
        {
          key: "respect_room_capacity",
          label: "Respect Room Capacity",
          render: (value) => (value ? "Yes" : "No"),
        },
      ],
    },
    {
      id: 'algorithm-settings',
      label: "Algorithm Settings",
      fields: [
        {
          key: "algorithm_timeout",
          label: "Algorithm Timeout",
          render: (value: any) => (value ? `${value} seconds` : "—"),
        },
        {
          key: "optimization_iterations",
          label: "Optimization Iterations",
        },
      ],
    },
    {
      id: 'timestamps',
      label: "Timestamps",
      fields: [
        {
          key: "created_at",
          label: "Created",
          render: (value: any) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
        {
          key: "updated_at",
          label: "Last Updated",
          render: (value: any) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
      ],
    },
  ],
};
