import type { EntityViewConfig } from "@/components/entityManager/composition/config/types";
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "—";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const classGroupScheduleViewConfig: EntityViewConfig<ClassGroupSchedule> = {
  title: (item?: ClassGroupSchedule) => `${item?.class_group_name || "Class"} - ${item?.unit_name || "Unit"}`,
  subtitle: (item?: ClassGroupSchedule) =>
    item?.day_of_week !== undefined
      ? `${DAY_OF_WEEK_LABELS[item.day_of_week as keyof typeof DAY_OF_WEEK_LABELS]} ${formatTime(
          item.start_time
        )} - ${formatTime(item.end_time)}`
      : "",
  fields: [],
  sections: [
    {
      id: "info",
      label: "Schedule Information",
      fields: [
        {
          key: "timetable_name",
          label: "Timetable",
        },
        {
          key: "class_group_name",
          label: "Class Group",
        },
        {
          key: "unit_name",
          label: "Unit",
        },
        {
          key: "instructor_name",
          label: "Instructor",
        },
      ],
    },
    {
      id: "location",
      label: "Location & Time",
      fields: [
        {
          key: "room_name",
          label: "Room",
        },
        {
          key: "day_of_week",
          label: "Day of Week",
          render: (value: unknown) =>
            value !== undefined ? String(DAY_OF_WEEK_LABELS[value as keyof typeof DAY_OF_WEEK_LABELS]) : "—",
        },
        {
          key: "start_time",
          label: "Start Time",
          render: (value: unknown) => formatTime(value as string | undefined),
        },
        {
          key: "end_time",
          label: "End Time",
          render: (value: unknown) => formatTime(value as string | undefined),
        },
      ],
    },
    {
      id: "status",
      label: "Status",
      fields: [
        {
          key: "is_locked",
          label: "Locked",
          render: (value: unknown) => (value ? "Yes (Protected from regeneration)" : "No"),
        },
        {
          key: "notes",
          label: "Notes",
        },
      ],
    },
    {
      id: "timestamps",
      label: "Timestamps",
      fields: [
        {
          key: "created_at",
          label: "Created",
          render: (value: unknown) => (value ? new Date(value as string).toLocaleString() : "—"),
        },
        {
          key: "updated_at",
          label: "Last Updated",
          render: (value: unknown) => (value ? new Date(value as string).toLocaleString() : "—"),
        },
      ],
    },
  ],
};
