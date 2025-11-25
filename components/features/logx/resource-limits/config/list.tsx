import type { ListConfig } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  LIMIT_RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { Badge } from "@/components/ui/badge";

export const resourceLimitListConfig: ListConfig<ResourceLimit> = {
  columns: [
    {
      key: "timetable_details",
      label: "Timetable",
      sortable: true,
      render: (value) => {
        if (value && typeof value === "object" && "name" in value) {
          return value.name;
        }
        return "-";
      },
    },
    {
      key: "entity_type",
      label: "Entity Type",
      sortable: true,
      render: (value) => {
        const label = ENTITY_TYPE_LABELS[value as keyof typeof ENTITY_TYPE_LABELS] || value;
        const colorMap: Record<string, string> = {
          teacher: "bg-purple-100 text-purple-800",
          room: "bg-blue-100 text-blue-800",
          class_group: "bg-green-100 text-green-800",
        };
        return (
          <Badge className={colorMap[value as string] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "resource_type",
      label: "Resource Type",
      sortable: true,
      render: (value) => {
        const label = LIMIT_RESOURCE_TYPE_LABELS[value as keyof typeof LIMIT_RESOURCE_TYPE_LABELS] || value;
        const colorMap: Record<string, string> = {
          hours: "bg-orange-100 text-orange-800",
          sessions: "bg-teal-100 text-teal-800",
        };
        return (
          <Badge className={colorMap[value as string] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "max_value",
      label: "Max Value",
      sortable: true,
      render: (value) => value?.toString() || "-",
    },
    {
      key: "period_type",
      label: "Period",
      sortable: true,
      render: (value) => {
        const label = PERIOD_TYPE_LABELS[value as keyof typeof PERIOD_TYPE_LABELS] || value;
        const colorMap: Record<string, string> = {
          daily: "bg-cyan-100 text-cyan-800",
          weekly: "bg-indigo-100 text-indigo-800",
        };
        return (
          <Badge className={colorMap[value as string] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ],
  defaultSort: {
    key: "entity_type",
    direction: "asc",
  },
  searchableFields: ["entity_type", "resource_type", "period_type"],
  filters: [
    {
      key: "entity_type",
      label: "Entity Type",
      type: "select",
      options: Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "resource_type",
      label: "Resource Type",
      type: "select",
      options: Object.entries(LIMIT_RESOURCE_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "period_type",
      label: "Period Type",
      type: "select",
      options: Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "is_active",
      label: "Status",
      type: "select",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
  ],
};

export default resourceLimitListConfig;
