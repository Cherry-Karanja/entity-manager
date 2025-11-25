import type { ExportConfig } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  LIMIT_RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";

export const resourceLimitExportConfig: ExportConfig<ResourceLimit> = {
  filename: "resource-limits",
  formats: ["csv", "excel", "pdf"],
  columns: [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "timetable_details",
      label: "Timetable",
      transform: (value) => {
        if (value && typeof value === "object" && "name" in value) {
          return value.name;
        }
        return "-";
      },
    },
    {
      key: "entity_type",
      label: "Entity Type",
      transform: (value) => 
        ENTITY_TYPE_LABELS[value as keyof typeof ENTITY_TYPE_LABELS] || value,
    },
    {
      key: "resource_type",
      label: "Resource Type",
      transform: (value) => 
        LIMIT_RESOURCE_TYPE_LABELS[value as keyof typeof LIMIT_RESOURCE_TYPE_LABELS] || value,
    },
    {
      key: "max_value",
      label: "Maximum Value",
    },
    {
      key: "period_type",
      label: "Period Type",
      transform: (value) => 
        PERIOD_TYPE_LABELS[value as keyof typeof PERIOD_TYPE_LABELS] || value,
    },
    {
      key: "is_active",
      label: "Status",
      transform: (value) => (value ? "Active" : "Inactive"),
    },
    {
      key: "created_at",
      label: "Created At",
      transform: (value) => 
        value ? new Date(value as string).toLocaleString() : "-",
    },
    {
      key: "updated_at",
      label: "Updated At",
      transform: (value) => 
        value ? new Date(value as string).toLocaleString() : "-",
    },
  ],
  defaultColumns: [
    "timetable_details",
    "entity_type",
    "resource_type",
    "max_value",
    "period_type",
    "is_active",
  ],
};

export default resourceLimitExportConfig;
