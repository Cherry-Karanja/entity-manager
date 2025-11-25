import { ViewConfig } from "@/components/entityManager";
import { TimetableConstraint, CONSTRAINT_TYPE_LABELS } from "../../types";

const formatParameters = (params: Record<string, unknown> | undefined): string => {
  if (!params) return "—";
  try {
    return JSON.stringify(params, null, 2);
  } catch {
    return "Invalid JSON";
  }
};

export const timetableConstraintViewConfig: ViewConfig<TimetableConstraint> = {
  title: (item) => item.name || "Timetable Constraint",
  subtitle: (item) =>
    item.is_hard_constraint ? "Hard Constraint (Must be satisfied)" : "Soft Constraint (Can be violated with penalty)",
  sections: [
    {
      title: "Basic Information",
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
          render: (value) =>
            CONSTRAINT_TYPE_LABELS[value as keyof typeof CONSTRAINT_TYPE_LABELS] || value,
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      title: "Constraint Configuration",
      fields: [
        {
          key: "is_hard_constraint",
          label: "Constraint Level",
          render: (value) => (value ? "Hard (Mandatory)" : "Soft (Preferred)"),
        },
        {
          key: "priority",
          label: "Priority",
          render: (value) => `${value} (${Number(value) <= 3 ? "High" : Number(value) <= 6 ? "Medium" : "Low"})`,
        },
        {
          key: "weight",
          label: "Weight",
        },
        {
          key: "is_active",
          label: "Status",
          render: (value) => (value ? "Active" : "Inactive"),
        },
      ],
    },
    {
      title: "Parameters",
      fields: [
        {
          key: "parameters",
          label: "Constraint Parameters",
          render: (value) => (
            <pre className="bg-muted p-2 rounded text-sm overflow-auto max-h-48">
              {formatParameters(value as Record<string, unknown>)}
            </pre>
          ),
        },
      ],
    },
    {
      title: "Timestamps",
      fields: [
        {
          key: "created_at",
          label: "Created",
          render: (value) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
        {
          key: "updated_at",
          label: "Last Updated",
          render: (value) =>
            value ? new Date(value as string).toLocaleString() : "—",
        },
      ],
    },
  ],
};
