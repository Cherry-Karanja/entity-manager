import type { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { TimetableConstraint, CONSTRAINT_TYPE_LABELS } from "../../types";

const formatParameters = (params: Record<string, unknown> | undefined): string => {
  if (!params) return "—";
  try {
    return JSON.stringify(params, null, 2);
  } catch {
    return "Invalid JSON";
  }
};

export const timetableConstraintViewConfig: EntityViewConfig<TimetableConstraint> = {
  fields: [],
  title: (item) => item?.name || "Timetable Constraint",
  subtitle: (item) =>
    item?.is_hard_constraint ? "Hard Constraint (Must be satisfied)" : "Soft Constraint (Can be violated with penalty)",
  sections: [
    {
      id: 'basic-information',
      label: "Basic Information",
      fields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "timetable_name",
          label: "Timetable",
        },
        {
          key: "constraint_type",
          label: "Constraint Type",
          render: (value: any) =>
            CONSTRAINT_TYPE_LABELS[value as keyof typeof CONSTRAINT_TYPE_LABELS] || value,
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      id: 'constraint-configuration',
      label: "Constraint Configuration",
      fields: [
        {
          key: "is_hard_constraint",
          label: "Constraint Level",
          render: (value: any) => (value ? "Hard (Mandatory)" : "Soft (Preferred)"),
        },
        {
          key: "priority",
          label: "Priority",
          render: (value: any) => `${value} (${Number(value) <= 3 ? "High" : Number(value) <= 6 ? "Medium" : "Low"})`,
        },
        {
          key: "weight",
          label: "Weight",
        },
        {
          key: "is_active",
          label: "Status",
          render: (value: any) => (value ? "Active" : "Inactive"),
        },
      ],
    },
    {
      id: 'parameters',
      label: "Parameters",
      fields: [
        {
          key: "parameters",
          label: "Constraint Parameters",
          render: (value: any) => (
            <pre className="bg-muted p-2 rounded text-sm overflow-auto max-h-48">
              {formatParameters(value as Record<string, unknown>)}
            </pre>
          ),
        },
      ],
    },
    {
      id: 'timestamps',
      label: "Timestamps",
      fields: [
        {
          key: "created_at",
          label: "Created",
          render: (value: any) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
        {
          key: "updated_at",
          label: "Last Updated",
          render: (value: any) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
      ],
    },
  ],
};
