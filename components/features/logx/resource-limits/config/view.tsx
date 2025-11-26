/**
 * Resource Limit View Field Configurations
 * 
 * Defines fields for the resource limit detail view.
 */

import { EntityViewConfig } from "@/components/entityManager/composition/config/types";
import { ResourceLimit } from "../../types";
import { 
  ENTITY_TYPE_LABELS, 
  RESOURCE_TYPE_LABELS, 
  PERIOD_TYPE_LABELS 
} from "../../types";
import { Badge } from "@/components/ui/badge";

export const ResourceLimitViewConfig: EntityViewConfig<ResourceLimit> = {
  fields: [
    {
      key: 'timetable_name',
      label: 'Timetable',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'entity_type',
      label: 'Entity Type',
      render: (entity) => {
        const value = (entity as ResourceLimit).entity_type;
        const label = ENTITY_TYPE_LABELS[value as keyof typeof ENTITY_TYPE_LABELS] || value;
        const colorMap: Record<string, string> = {
          class_group: "bg-green-100 text-green-800",
          trainer: "bg-purple-100 text-purple-800",
          room: "bg-blue-100 text-blue-800",
          department: "bg-orange-100 text-orange-800",
        };
        return (
          <Badge className={colorMap[value] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: 'resource_type',
      label: 'Resource Type',
      render: (entity) => {
        const value = (entity as ResourceLimit).resource_type;
        const label = RESOURCE_TYPE_LABELS[value as keyof typeof RESOURCE_TYPE_LABELS] || value;
        const colorMap: Record<string, string> = {
          room_hours: "bg-orange-100 text-orange-800",
          class_hours: "bg-teal-100 text-teal-800",
          equipment_usage: "bg-indigo-100 text-indigo-800",
          budget: "bg-pink-100 text-pink-800",
        };
        return (
          <Badge className={colorMap[value] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: 'max_limit',
      label: 'Maximum Limit',
      type: 'number',
    },
    {
      key: 'current_usage',
      label: 'Current Usage',
      type: 'number',
    },
    {
      key: 'period_type',
      label: 'Period Type',
      render: (entity) => {
        const value = (entity as ResourceLimit).period_type;
        const label = PERIOD_TYPE_LABELS[value as keyof typeof PERIOD_TYPE_LABELS] || value;
        const colorMap: Record<string, string> = {
          daily: "bg-cyan-100 text-cyan-800",
          weekly: "bg-indigo-100 text-indigo-800",
          monthly: "bg-violet-100 text-violet-800",
          term: "bg-amber-100 text-amber-800",
          year: "bg-lime-100 text-lime-800",
        };
        return (
          <Badge className={colorMap[value] || "bg-gray-100 text-gray-800"}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const value = (entity as ResourceLimit).is_active;
        return (
          <Badge 
            variant={value ? "default" : "secondary"}
            className={value ? "bg-green-600 text-white" : ""}
          >
            {value ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'date',
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
    },
  ],

  groups: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Timetable and entity details',
      fields: ['timetable_name', 'entity_type'],
      collapsible: true,
      order: 1,
    },
    {
      id: 'limit',
      label: 'Limit Configuration',
      description: 'Resource limit settings',
      fields: ['resource_type', 'max_limit', 'current_usage', 'period_type'],
      collapsible: true,
      order: 2,
    },
    {
      id: 'status',
      label: 'Status & Metadata',
      description: 'Status and timestamps',
      fields: ['is_active', 'created_at', 'updated_at'],
      collapsible: true,
      order: 3,
    },
  ],

  mode: 'detail',
  showMetadata: true,

  titleField: 'entity_type',
  subtitleField: 'resource_type',

  actions: [],
};

// Convenience exports for backward compatibility
export const resourceLimitViewFields = ResourceLimitViewConfig.fields;
export const resourceLimitViewGroups = ResourceLimitViewConfig.groups;
