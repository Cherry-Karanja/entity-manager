import { ColumnConfig } from "@/components/entityManager";
import { Badge } from "@/components/ui/badge";
import { PenaltyRule, VIOLATION_TYPE_LABELS } from "../../types";
import { Check, X } from "lucide-react";

export const penaltyRuleColumns: ColumnConfig<PenaltyRule>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (value) => <span className="font-medium">{value}</span>,
  },
  {
    key: "timetable_name",
    header: "Timetable",
    sortable: true,
  },
  {
    key: "violation_type",
    header: "Violation Type",
    sortable: true,
    render: (value) => (
      <Badge variant="outline">
        {VIOLATION_TYPE_LABELS[value as keyof typeof VIOLATION_TYPE_LABELS] || value}
      </Badge>
    ),
  },
  {
    key: "base_penalty",
    header: "Base Penalty",
    sortable: true,
  },
  {
    key: "multiplier",
    header: "Multiplier",
    sortable: true,
    render: (value) => `×${value}`,
  },
  {
    key: "max_penalty",
    header: "Max Penalty",
    sortable: true,
    render: (value) => (value ? value : "No cap"),
  },
  {
    key: "threshold",
    header: "Threshold",
    sortable: true,
    render: (value) => (value ? `${value} violations` : "Immediate"),
  },
  {
    key: "is_active",
    header: "Active",
    render: (value) =>
      value ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
];
