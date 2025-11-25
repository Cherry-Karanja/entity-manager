import { ViewConfig } from "@/components/entityManager";
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "—";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const classGroupScheduleViewConfig: ViewConfig<ClassGroupSchedule> = {
  title: (item) => `${item.class_group_name || "Class"} - ${item.unit_name || "Unit"}`,
  subtitle: (item) =>
    item.day_of_week !== undefined
      ? `${DAY_OF_WEEK_LABELS[item.day_of_week as keyof typeof DAY_OF_WEEK_LABELS]} ${formatTime(item.start_time)} - ${formatTime(item.end_time)}`
      : undefined,
  sections: [
    {
      title: "Schedule Information",
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
      title: "Location & Time",
      fields: [
        {
          key: "room_name",
          label: "Room",
        },
        {
          key: "day_of_week",
          label: "Day of Week",
          render: (value) =>
            value !== undefined
              ? DAY_OF_WEEK_LABELS[value as keyof typeof DAY_OF_WEEK_LABELS]
              : "—",
        },
        {
          key: "start_time",
          label: "Start Time",
          render: (value) => formatTime(value as string | undefined),
        },
        {
          key: "end_time",
          label: "End Time",
          render: (value) => formatTime(value as string | undefined),
        },
      ],
    },
    {
      title: "Status",
      fields: [
        {
          key: "is_locked",
          label: "Locked",
          render: (value) => (value ? "Yes (Protected from regeneration)" : "No"),
        },
        {
          key: "notes",
          label: "Notes",
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
