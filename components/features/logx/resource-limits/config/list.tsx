import type { EntityListConfig } from "@/components/entityManager/composition/config/types";
import type { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { Badge } from "@/components/ui/badge";

export const resourceLimitListConfig: EntityListConfig<ResourceLimit> = {
  columns: [
    {
      key: "timetable_details",
      label: "Timetable",
      sortable: true,
      render: (value: unknown) => {
        if (value && typeof value === "object" && "name" in (value as any)) {
          return (value as any).name as string;
        }
        return "-";
      },
    },
    {
      key: "entity_type",
      label: "Entity Type",
      sortable: true,
      render: (value: unknown) => {
        const label = ENTITY_TYPE_LABELS[(value as any) as keyof typeof ENTITY_TYPE_LABELS] || (value as any);
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
      render: (value: unknown) => {
        const label = RESOURCE_TYPE_LABELS[(value as any) as keyof typeof RESOURCE_TYPE_LABELS] || (value as any);
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
      render: (value: unknown) => (value as any)?.toString() || "-",
    },
    {
      key: "period_type",
      label: "Period",
      sortable: true,
      render: (value: unknown) => {
        const label = PERIOD_TYPE_LABELS[(value as any) as keyof typeof PERIOD_TYPE_LABELS] || (value as any);
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
      render: (value: unknown) => (
        <Badge variant={(value as boolean) ? "default" : "secondary"}>
          {(value as boolean) ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ],
  sortConfig: {
    field: "entity_type",
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
      options: Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({
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
