import type { EntityExporterConfig } from "@/components/entityManager/composition/config/types";
import { PenaltyRule, VIOLATION_TYPE_LABELS } from "../../types";

export const penaltyRuleExportConfig: EntityExporterConfig<PenaltyRule> = {
  options: {
    format: "csv",
    filename: "penalty-rules",
    includeHeaders: true,
  },
  fields: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "timetable_name", label: "Timetable" },
    {
      key: "violation_type",
      label: "Violation Type",
      formatter: (value: unknown) =>
        VIOLATION_TYPE_LABELS[value as keyof typeof VIOLATION_TYPE_LABELS] || String(value),
    },
    { key: "base_penalty", label: "Base Penalty" },
    { key: "multiplier", label: "Multiplier" },
    {
      key: "max_penalty",
      label: "Max Penalty",
      formatter: (value: unknown) => (value ? String(value) : "No cap"),
    },
    {
      key: "threshold",
      label: "Threshold",
      formatter: (value: unknown) => (value ? String(value) : "0"),
    },
    {
      key: "is_active",
      label: "Active",
      formatter: (value: unknown) => (value ? "Yes" : "No"),
    },
    { key: "description", label: "Description" },
    {
      key: "created_at",
      label: "Created",
      formatter: (value: unknown) => (value ? new Date(value as string).toLocaleDateString() : ""),
    },
  ],
};
