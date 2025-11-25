import { ExportConfig } from "@/components/entityManager";
import { VirtualResource, RESOURCE_TYPE_LABELS } from "../../types";

const formatTime = (time: string | undefined): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const virtualResourceExportConfig: ExportConfig<VirtualResource> = {
  filename: "virtual-resources",
  fields: [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    { key: "timetable_name", header: "Timetable" },
    {
      key: "resource_type",
      header: "Type",
      transform: (value) =>
        RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value,
    },
    { key: "capacity", header: "Capacity" },
    {
      key: "availability_start",
      header: "Available From",
      transform: (value) => formatTime(value as string | undefined),
    },
    {
      key: "availability_end",
      header: "Available Until",
      transform: (value) => formatTime(value as string | undefined),
    },
    {
      key: "is_shared",
      header: "Shared",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "is_active",
      header: "Active",
      transform: (value) => (value ? "Yes" : "No"),
    },
    { key: "description", header: "Description" },
    {
      key: "created_at",
      header: "Created",
      transform: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "",
    },
  ],
};
