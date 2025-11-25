import { ExportConfig } from "@/components/entityManager";
import { PenaltyRule, VIOLATION_TYPE_LABELS } from "../../types";

export const penaltyRuleExportConfig: ExportConfig<PenaltyRule> = {
  filename: "penalty-rules",
  fields: [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "timetable_name", header: "Timetable" },
    {
      key: "violation_type",
      header: "Violation Type",
      transform: (value) =>
        VIOLATION_TYPE_LABELS[value as keyof typeof VIOLATION_TYPE_LABELS] || value,
    },
    { key: "base_penalty", header: "Base Penalty" },
    { key: "multiplier", header: "Multiplier" },
    {
      key: "max_penalty",
      header: "Max Penalty",
      transform: (value) => (value ? String(value) : "No cap"),
    },
    {
      key: "threshold",
      header: "Threshold",
      transform: (value) => (value ? String(value) : "0"),
    },
    {
      key: "is_active",
      header: "Active",
      transform: (value) => (value ? "Yes" : "No"),
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
