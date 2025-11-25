import type { ViewConfig } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { Badge } from "@/components/ui/badge";

export const resourceLimitViewConfig: ViewConfig<ResourceLimit> = {
  title: (item) => {
    const entityLabel = ENTITY_TYPE_LABELS[item.entity_type as keyof typeof ENTITY_TYPE_LABELS] || item.entity_type;
    const resourceLabel = RESOURCE_TYPE_LABELS[item.resource_type as keyof typeof RESOURCE_TYPE_LABELS] || item.resource_type;
    return `${entityLabel} - ${resourceLabel} Limit`;
  },
  subtitle: (item) => {
    const periodLabel = PERIOD_TYPE_LABELS[item.period_type as keyof typeof PERIOD_TYPE_LABELS] || item.period_type;
    return `Max: ${item.max_value} ${periodLabel}`;
  },
  sections: [
    {
      title: "Basic Information",
      fields: [
        {
          key: "timetable_details",
          label: "Timetable",
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
          render: (value) => {
            const label = RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value;
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
      ],
    },
    {
      title: "Limit Configuration",
      fields: [
        {
          key: "max_value",
          label: "Maximum Value",
          render: (value) => (
            <span className="text-lg font-semibold">{value?.toString() || "-"}</span>
          ),
        },
        {
          key: "period_type",
          label: "Period Type",
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
      ],
    },
    {
      title: "Status",
      fields: [
        {
          key: "is_active",
          label: "Active Status",
          render: (value) => (
            <Badge 
              variant={value ? "default" : "secondary"}
              className={value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {value ? "Active" : "Inactive"}
            </Badge>
          ),
        },
        {
          key: "created_at",
          label: "Created At",
          render: (value) => 
            value ? new Date(value as string).toLocaleString() : "-",
        },
        {
          key: "updated_at",
          label: "Updated At",
          render: (value) => 
            value ? new Date(value as string).toLocaleString() : "-",
        },
      ],
    },
  ],
};

export default resourceLimitViewConfig;
