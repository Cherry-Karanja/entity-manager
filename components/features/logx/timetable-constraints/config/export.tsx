import { ExportConfig } from "@/components/entityManager";
import { TimetableConstraint, CONSTRAINT_TYPE_LABELS } from "../../types";

export const timetableConstraintExportConfig: ExportConfig<TimetableConstraint> = {
  filename: "timetable-constraints",
  fields: [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "timetable_name", header: "Timetable" },
    {
      key: "constraint_type",
      header: "Type",
      transform: (value) =>
        CONSTRAINT_TYPE_LABELS[value as keyof typeof CONSTRAINT_TYPE_LABELS] || value,
    },
    {
      key: "is_hard_constraint",
      header: "Constraint Level",
      transform: (value) => (value ? "Hard" : "Soft"),
    },
    { key: "priority", header: "Priority" },
    { key: "weight", header: "Weight" },
    {
      key: "is_active",
      header: "Active",
      transform: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "parameters",
      header: "Parameters",
      transform: (value) => {
        if (!value) return "";
        try {
          return JSON.stringify(value);
        } catch {
          return "";
        }
      },
    },
    { key: "description", header: "Description" },
    {
      key: "created_at",
      header: "Created",
      transform: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "",
    },
  ],
};
