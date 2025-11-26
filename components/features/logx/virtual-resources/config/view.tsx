import type { EntityViewConfig } from "@/components/entityManager/composition/config/types";
import { VirtualResource, RESOURCE_TYPE_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "—";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const virtualResourceViewConfig: EntityViewConfig<VirtualResource> = {
  title: (item?: VirtualResource) => item?.name || "Virtual Resource",
  subtitle: (item?: VirtualResource) => item?.code || "",
  fields: [],
  sections: [
    {
      id: "basic",
      label: "Basic Information",
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
          render: (value: unknown) =>
            RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || String(value),
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      id: "availability",
      label: "Capacity & Availability",
      fields: [
        {
          key: "capacity",
          label: "Capacity",
          render: (value: unknown) => (value ? String(value) : "Not specified"),
        },
        {
          key: "availability_start",
          label: "Available From",
          render: (value: unknown) => formatTime(value as string | undefined),
        },
        {
          key: "availability_end",
          label: "Available Until",
          render: (value: unknown) => formatTime(value as string | undefined),
        },
      ],
    },
    {
      id: "config",
      label: "Configuration",
      fields: [
        {
          key: "is_shared",
          label: "Shared Resource",
          render: (value: unknown) =>
            (value as boolean) ? "Yes (Can be used by multiple schedules)" : "No (Exclusive use)",
        },
        {
          key: "is_active",
          label: "Status",
          render: (value: unknown) => ((value as boolean) ? "Active" : "Inactive"),
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
