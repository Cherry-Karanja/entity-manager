import { ExportConfig } from "@/components/entityManager";
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const classGroupScheduleExportConfig: ExportConfig<ClassGroupSchedule> = {
  filename: "class-group-schedules",
  fields: [
    { key: "id", header: "ID" },
    { key: "timetable_name", header: "Timetable" },
    { key: "class_group_name", header: "Class Group" },
    { key: "unit_name", header: "Unit" },
    { key: "instructor_name", header: "Instructor" },
    { key: "room_name", header: "Room" },
    {
      key: "day_of_week",
      header: "Day",
      transform: (value) =>
        value !== undefined
          ? DAY_OF_WEEK_LABELS[value as keyof typeof DAY_OF_WEEK_LABELS]
          : "",
    },
    {
      key: "start_time",
      header: "Start Time",
      transform: (value) => formatTime(value as string | undefined),
    },
    {
      key: "end_time",
      header: "End Time",
      transform: (value) => formatTime(value as string | undefined),
    },
    {
      key: "is_locked",
      header: "Locked",
      transform: (value) => (value ? "Yes" : "No"),
    },
    { key: "notes", header: "Notes" },
    {
      key: "created_at",
      header: "Created",
      transform: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "",
    },
  ],
};
