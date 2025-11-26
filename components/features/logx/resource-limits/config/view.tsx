import type { EntityViewConfig } from "@/components/entityManager/composition/config/types";
import type { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { Badge } from "@/components/ui/badge";

export const resourceLimitViewConfig: EntityViewConfig<ResourceLimit> = {
  title: (item?: ResourceLimit) => {
    const entityLabel = ENTITY_TYPE_LABELS[(item as any)?.entity_type as keyof typeof ENTITY_TYPE_LABELS] || (item as any)?.entity_type;
    const resourceLabel = RESOURCE_TYPE_LABELS[(item as any)?.resource_type as keyof typeof RESOURCE_TYPE_LABELS] || (item as any)?.resource_type;
    return `${entityLabel} - ${resourceLabel} Limit`;
  },
  subtitle: (item?: ResourceLimit) => {
    const periodLabel = PERIOD_TYPE_LABELS[(item as any)?.period_type as keyof typeof PERIOD_TYPE_LABELS] || (item as any)?.period_type;
    return `Max: ${(item as any)?.max_value} ${periodLabel}`;
  },
  fields: [],
  sections: [
    {
      id: "basic_information",
      label: "Basic Information",
      fields: [
        {
          key: "timetable_details",
          label: "Timetable",
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
          render: (value: unknown) => {
            const label = ENTITY_TYPE_LABELS[(value as any) as keyof typeof ENTITY_TYPE_LABELS] || (value as any);
            const colorMap: Record<string, string> = {
              teacher: "bg-purple-100 text-purple-800",
              room: "bg-blue-100 text-blue-800",
              class_group: "bg-green-100 text-green-800",
            };
            return (
              <Badge className={colorMap[(value as any) as string] || "bg-gray-100 text-gray-800"}>
                {label}
              </Badge>
            );
          },
        },
        {
          key: "resource_type",
          label: "Resource Type",
          render: (value: unknown) => {
            const label = RESOURCE_TYPE_LABELS[(value as any) as keyof typeof RESOURCE_TYPE_LABELS] || (value as any);
            const colorMap: Record<string, string> = {
              hours: "bg-orange-100 text-orange-800",
              sessions: "bg-teal-100 text-teal-800",
            };
            return (
              <Badge className={colorMap[(value as any) as string] || "bg-gray-100 text-gray-800"}>
                {label}
              </Badge>
            );
          },
        },
      ],
    },
    {
      id: "limit_configuration",
      label: "Limit Configuration",
      fields: [
        {
          key: "max_value",
          label: "Maximum Value",
          render: (value: unknown) => (
            <span className="text-lg font-semibold">{(value as any)?.toString() || "-"}</span>
          ),
        },
        {
          key: "period_type",
          label: "Period Type",
          render: (value: unknown) => {
            const label = PERIOD_TYPE_LABELS[(value as any) as keyof typeof PERIOD_TYPE_LABELS] || (value as any);
            const colorMap: Record<string, string> = {
              daily: "bg-cyan-100 text-cyan-800",
              weekly: "bg-indigo-100 text-indigo-800",
            };
            return (
              <Badge className={colorMap[(value as any) as string] || "bg-gray-100 text-gray-800"}>
                {label}
              </Badge>
            );
          },
        },
      ],
    },
    {
      id: "status",
      label: "Status",
      fields: [
        {
          key: "is_active",
          label: "Active Status",
          render: (value: unknown) => (
            <Badge 
              variant={(value as boolean) ? "default" : "secondary"}
              className={(value as boolean) ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {(value as boolean) ? "Active" : "Inactive"}
            </Badge>
          ),
        },
        {
          key: "created_at",
          label: "Created At",
          render: (value: unknown) => 
            value ? new Date(value as string).toLocaleString() : "-",
        },
        {
          key: "updated_at",
          label: "Updated At",
          render: (value: unknown) => 
            value ? new Date(value as string).toLocaleString() : "-",
        },
      ],
    },
  ],
};

export default resourceLimitViewConfig;
