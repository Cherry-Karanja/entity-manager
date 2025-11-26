import type { EntityExporterConfig } from "@/components/entityManager/composition/config/types";
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = ((hour + 11) % 12) + 1;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const classGroupScheduleExportConfig: EntityExporterConfig<ClassGroupSchedule> = {
  options: {
    format: "csv",
    filename: "class-group-schedules",
    includeHeaders: true,
  },
  fields: [
    { key: "id", label: "ID" },
    { key: "timetable_name", label: "Timetable" },
    { key: "class_group_name", label: "Class Group" },
    { key: "unit_name", label: "Unit" },
    { key: "instructor_name", label: "Instructor" },
    { key: "room_name", label: "Room" },
    {
      key: "day_of_week",
      label: "Day",
      formatter: (value: unknown) =>
        value !== undefined ? String(DAY_OF_WEEK_LABELS[value as keyof typeof DAY_OF_WEEK_LABELS]) : "",
    },
    {
      key: "start_time",
      label: "Start Time",
      formatter: (value: unknown) => formatTime(value as string | undefined),
    },
    {
      key: "end_time",
      label: "End Time",
      formatter: (value: unknown) => formatTime(value as string | undefined),
    },
    {
      key: "is_locked",
      label: "Locked",
      formatter: (value: unknown) => (value ? "Yes" : "No"),
    },
    { key: "notes", label: "Notes" },
    {
      key: "created_at",
      label: "Created",
      formatter: (value: unknown) => (value ? new Date(value as string).toLocaleDateString() : ""),
    },
  ],
};
