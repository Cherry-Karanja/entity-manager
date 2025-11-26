import type { EntityViewConfig } from "@/components/entityManager/composition/config/types";
import { PenaltyRule, VIOLATION_TYPE_LABELS } from "../../types";

export const penaltyRuleViewConfig: EntityViewConfig<PenaltyRule> = {
  fields: [],
  title: (item?: PenaltyRule) => item?.name || "Penalty Rule",
  subtitle: (item?: PenaltyRule) =>
    item?.violation_type
      ? VIOLATION_TYPE_LABELS[item.violation_type as keyof typeof VIOLATION_TYPE_LABELS]
      : '',
  sections: [
    {
      id: "basic",
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
          key: "violation_type",
          label: "Violation Type",
          render: (value: unknown) =>
            VIOLATION_TYPE_LABELS[value as keyof typeof VIOLATION_TYPE_LABELS] || String(value),
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      id: "penalty",
      label: "Penalty Configuration",
      fields: [
        {
          key: "base_penalty",
          label: "Base Penalty",
        },
        {
          key: "multiplier",
          label: "Multiplier",
          render: (value: unknown) => `×${String(value)}`,
        },
        {
          key: "max_penalty",
          label: "Maximum Penalty",
          render: (value: unknown) => (value ? String(value) : "No cap"),
        },
        {
          key: "threshold",
          label: "Threshold",
          render: (value: unknown) =>
            value ? `${String(value)} violations before penalty applies` : "Penalty applies immediately",
        },
      ],
    },
    {
      id: "status",
      label: "Status",
      fields: [
        {
          key: "is_active",
          label: "Status",
          render: (value: unknown) => (value ? "Active" : "Inactive"),
        },
      ],
    },
    {
      id: "timestamps",
      label: "Timestamps",
      fields: [
        {
          key: "created_at",
          label: "Created",
          render: (value: unknown) => (value ? new Date(value as string).toLocaleString() : "—"),
        },
        {
          key: "updated_at",
          label: "Last Updated",
          render: (value: unknown) => (value ? new Date(value as string).toLocaleDateString() : "—"),
        },
      ],
    },
  ],
};
