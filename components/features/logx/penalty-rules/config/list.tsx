import type { Column } from "@/components/entityManager/components/list/types";
import { Badge } from "@/components/ui/badge";
import { PenaltyRule, VIOLATION_TYPE_LABELS } from "../../types";
import { Check, X } from "lucide-react";

export const penaltyRuleColumns: Column<PenaltyRule>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (value: unknown) => <span className="font-medium">{String(value)}</span>,
  },
  {
    key: "timetable_name",
    label: "Timetable",
    sortable: true,
  },
  {
    key: "violation_type",
    label: "Violation Type",
    sortable: true,
    render: (value: unknown) => (
      <Badge variant="outline">
        {VIOLATION_TYPE_LABELS[value as keyof typeof VIOLATION_TYPE_LABELS] || String(value)}
      </Badge>
    ),
  },
  {
    key: "base_penalty",
    label: "Base Penalty",
    sortable: true,
  },
  {
    key: "multiplier",
    label: "Multiplier",
    sortable: true,
    render: (value: unknown) => `×${String(value)}`,
  },
  {
    key: "max_penalty",
    label: "Max Penalty",
    sortable: true,
    render: (value: unknown) => (value ? String(value) : "No cap"),
  },
  {
    key: "threshold",
    label: "Threshold",
    sortable: true,
    render: (value: unknown) => (value ? `${String(value)} violations` : "Immediate"),
  },
  {
    key: "is_active",
    label: "Active",
    render: (value: unknown) =>
      value ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
];
