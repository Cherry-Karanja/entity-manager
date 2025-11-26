/**
 * Resource Limit List Column Configurations
 * 
 * Defines columns for the resource limit list view.
 */

import { EntityListConfig } from "@/components/entityManager/composition/config/types";
import { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { Badge } from "@/components/ui/badge";

export const ResourceLimitListConfig: EntityListConfig<ResourceLimit> = {
  columns: [
    {
      key: "timetable_name",
      label: "Timetable",
      sortable: true,
      width: '20%',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: "entity_type",
      label: "Entity Type",
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value) => {
        const label = ENTITY_TYPE_LABELS[(value as string) as keyof typeof ENTITY_TYPE_LABELS] || (value as string);
        const colorMap: Record<string, string> = {
          class_group: "bg-green-100 text-green-800",
          trainer: "bg-purple-100 text-purple-800",
          room: "bg-blue-100 text-blue-800",
          department: "bg-orange-100 text-orange-800",
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
      filterable: true,
      width: '15%',
      render: (value) => {
        const label = RESOURCE_TYPE_LABELS[(value as string) as keyof typeof RESOURCE_TYPE_LABELS] || (value as string);
        const colorMap: Record<string, string> = {
          room_hours: "bg-orange-100 text-orange-800",
          class_hours: "bg-teal-100 text-teal-800",
          equipment_usage: "bg-indigo-100 text-indigo-800",
          budget: "bg-pink-100 text-pink-800",
        };
        return (
          <Badge className={colorMap[value as string] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "max_limit",
      label: "Max Limit",
      sortable: true,
      width: '12%',
      align: 'center',
      type: 'number',
    },
    {
      key: "current_usage",
      label: "Current Usage",
      sortable: true,
      width: '12%',
      align: 'center',
      type: 'number',
    },
    {
      key: "period_type",
      label: "Period",
      sortable: true,
      filterable: true,
      width: '12%',
      render: (value) => {
        const label = PERIOD_TYPE_LABELS[(value as string) as keyof typeof PERIOD_TYPE_LABELS] || (value as string);
        const colorMap: Record<string, string> = {
          daily: "bg-cyan-100 text-cyan-800",
          weekly: "bg-indigo-100 text-indigo-800",
          monthly: "bg-violet-100 text-violet-800",
          term: "bg-amber-100 text-amber-800",
          year: "bg-lime-100 text-lime-800",
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
      filterable: true,
      width: '10%',
      type: 'boolean',
      render: (value) => (
        <Badge variant={(value as boolean) ? "default" : "secondary"} className={(value as boolean) ? "bg-green-600" : ""}>
          {(value as boolean) ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ],

  view: 'table',

  toolbar: {
    search: true,
    filters: true,
    viewSwitcher: true,
    columnSelector: true,
    refresh: true,
    export: true,
  },

  selectable: true,
  multiSelect: true,

  pagination: true,
  paginationConfig: {
    page: 1,
    pageSize: 10,
  },

  sortable: true,
  sortConfig: { field: 'entity_type', direction: 'asc' },

  filterable: true,
  filterConfigs: [
    { field: 'is_active', operator: 'equals', value: true },
    { field: 'entity_type', operator: 'in', value: [] },
    { field: 'resource_type', operator: 'in', value: [] },
    { field: 'period_type', operator: 'in', value: [] },
  ],

  searchable: true,
  searchPlaceholder: 'Search resource limits...',

  emptyMessage: 'No resource limits found.',

  hover: true,
  striped: true,
  bordered: true,
};
