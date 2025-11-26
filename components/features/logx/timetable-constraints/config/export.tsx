import type { EntityExporterConfig } from "@/components/entityManager/composition/config/types";
import { TimetableConstraint, CONSTRAINT_TYPE_LABELS } from "../../types";

export const timetableConstraintExportConfig: EntityExporterConfig<TimetableConstraint> = {
  fields: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "timetable_name", label: "Timetable" },
    {
      key: "constraint_type",
      label: "Type",
      formatter: (value) =>
        CONSTRAINT_TYPE_LABELS[value as keyof typeof CONSTRAINT_TYPE_LABELS] || String(value),
    },
    {
      key: "is_hard_constraint",
      label: "Constraint Level",
      formatter: (value) => (value ? "Hard" : "Soft"),
    },
    { key: "priority", label: "Priority" },
    { key: "weight", label: "Weight" },
    {
      key: "is_active",
      label: "Active",
      formatter: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "parameters",
      label: "Parameters",
      formatter: (value) => {
        if (!value) return "";
        try {
          return JSON.stringify(value);
        } catch {
          return "";
        }
      },
    },
    { key: "description", label: "Description" },
    {
      key: "created_at",
      label: "Created",
      formatter: (value) => (value ? new Date(value as string).toLocaleDateString() : ""),
    },
  ],
  options: { format: 'csv', filename: "timetable-constraints" },
};
