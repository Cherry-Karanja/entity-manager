import { ViewConfig } from "@/components/entityManager";
import { PenaltyRule, VIOLATION_TYPE_LABELS } from "../../types";

export const penaltyRuleViewConfig: ViewConfig<PenaltyRule> = {
  title: (item) => item.name || "Penalty Rule",
  subtitle: (item) =>
    item.violation_type
      ? VIOLATION_TYPE_LABELS[item.violation_type as keyof typeof VIOLATION_TYPE_LABELS]
      : undefined,
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
          key: "violation_type",
          label: "Violation Type",
          render: (value) =>
            VIOLATION_TYPE_LABELS[value as keyof typeof VIOLATION_TYPE_LABELS] || value,
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      title: "Penalty Configuration",
      fields: [
        {
          key: "base_penalty",
          label: "Base Penalty",
        },
        {
          key: "multiplier",
          label: "Multiplier",
          render: (value) => `×${value}`,
        },
        {
          key: "max_penalty",
          label: "Maximum Penalty",
          render: (value) => (value ? String(value) : "No cap"),
        },
        {
          key: "threshold",
          label: "Threshold",
          render: (value) =>
            value ? `${value} violations before penalty applies` : "Penalty applies immediately",
        },
      ],
    },
    {
      title: "Status",
      fields: [
        {
          key: "is_active",
          label: "Status",
          render: (value) => (value ? "Active" : "Inactive"),
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
