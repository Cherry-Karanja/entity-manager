import type { EntityExporterConfig } from "@/components/entityManager/composition/config/types";
import { VirtualResource, RESOURCE_TYPE_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const virtualResourceExportConfig: EntityExporterConfig<VirtualResource> = {
  options: {
    format: "csv",
    filename: "virtual-resources",
    includeHeaders: true,
  },
  fields: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "timetable_name", label: "Timetable" },
    {
      key: "resource_type",
      label: "Type",
      formatter: (value: unknown) =>
        RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || String(value),
    },
    { key: "capacity", label: "Capacity" },
    {
      key: "availability_start",
      label: "Available From",
      formatter: (value: unknown) => formatTime(value as string | undefined),
    },
    {
      key: "availability_end",
      label: "Available Until",
      formatter: (value: unknown) => formatTime(value as string | undefined),
    },
    {
      key: "is_shared",
      label: "Shared",
      formatter: (value: unknown) => (value ? "Yes" : "No"),
    },
    {
      key: "is_active",
      label: "Active",
      formatter: (value: unknown) => (value ? "Yes" : "No"),
    },
    { key: "description", label: "Description" },
    {
      key: "created_at",
      label: "Created",
      formatter: (value: unknown) => (value ? new Date(value as string).toLocaleDateString() : ""),
    },
  ],
};
