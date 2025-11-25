import { ViewConfig } from "@/components/entityManager";
import { VirtualResource, RESOURCE_TYPE_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "—";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const virtualResourceViewConfig: ViewConfig<VirtualResource> = {
  title: (item) => item.name || "Virtual Resource",
  subtitle: (item) => item.code,
  sections: [
    {
      title: "Basic Information",
      fields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "code",
          label: "Code",
        },
        {
          key: "timetable_name",
          label: "Timetable",
        },
        {
          key: "resource_type",
          label: "Resource Type",
          render: (value) =>
            RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value,
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      title: "Capacity & Availability",
      fields: [
        {
          key: "capacity",
          label: "Capacity",
          render: (value) => (value ? String(value) : "Not specified"),
        },
        {
          key: "availability_start",
          label: "Available From",
          render: (value) => formatTime(value as string | undefined),
        },
        {
          key: "availability_end",
          label: "Available Until",
          render: (value) => formatTime(value as string | undefined),
        },
      ],
    },
    {
      title: "Configuration",
      fields: [
        {
          key: "is_shared",
          label: "Shared Resource",
          render: (value) =>
            value ? "Yes (Can be used by multiple schedules)" : "No (Exclusive use)",
        },
        {
          key: "is_active",
          label: "Status",
          render: (value) => (value ? "Active" : "Inactive"),
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
