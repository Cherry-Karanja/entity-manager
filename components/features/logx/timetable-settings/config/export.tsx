import { ExportConfig } from "@/components/entityManager";
import { TimetableSettings } from "../../types";

export const timetableSettingsExportConfig: ExportConfig<TimetableSettings> = {
  filename: "timetable-settings",
  fields: [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "institution_name", header: "Institution" },
    { key: "max_lessons_per_day", header: "Max Lessons/Day" },
    { key: "max_consecutive_lessons", header: "Max Consecutive" },
    { key: "min_break_duration", header: "Min Break (min)" },
    {
      key: "allow_split_lessons",
      header: "Allow Split",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "prefer_morning_classes",
      header: "Prefer Morning",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "balance_daily_load",
      header: "Balance Load",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "avoid_gaps",
      header: "Avoid Gaps",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "respect_room_capacity",
      header: "Room Capacity",
      transform: (value) => (value ? "Yes" : "No"),
    },
    { key: "algorithm_timeout", header: "Timeout (s)" },
    { key: "optimization_iterations", header: "Iterations" },
    {
      key: "is_default",
      header: "Default",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "created_at",
      header: "Created",
      transform: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "",
    },
  ],
};
