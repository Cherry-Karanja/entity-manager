import { ViewConfig } from "@/components/entityManager";
import { TimetableSettings } from "../../types";

export const timetableSettingsViewConfig: ViewConfig<TimetableSettings> = {
  title: (item) => item.name || "Timetable Settings",
  subtitle: (item) => (item.is_default ? "Default Settings" : "Custom Settings"),
  sections: [
    {
      title: "Basic Information",
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
          render: (value) => (value ? "Yes" : "No"),
        },
      ],
    },
    {
      title: "Lesson Constraints",
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
          render: (value) => (value ? `${value} minutes` : "—"),
        },
        {
          key: "allow_split_lessons",
          label: "Allow Split Lessons",
          render: (value) => (value ? "Yes" : "No"),
        },
      ],
    },
    {
      title: "Scheduling Preferences",
      fields: [
        {
          key: "prefer_morning_classes",
          label: "Prefer Morning Classes",
          render: (value) => (value ? "Yes" : "No"),
        },
        {
          key: "balance_daily_load",
          label: "Balance Daily Load",
          render: (value) => (value ? "Yes" : "No"),
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
      title: "Algorithm Settings",
      fields: [
        {
          key: "algorithm_timeout",
          label: "Algorithm Timeout",
          render: (value) => (value ? `${value} seconds` : "—"),
        },
        {
          key: "optimization_iterations",
          label: "Optimization Iterations",
        },
      ],
    },
    {
      title: "Timestamps",
      fields: [
        {
          key: "created_at",
          label: "Created",
          render: (value) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
        {
          key: "updated_at",
          label: "Last Updated",
          render: (value) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
      ],
    },
  ],
};
