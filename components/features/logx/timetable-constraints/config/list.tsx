import { ColumnConfig } from "@/components/entityManager";
import { Badge } from "@/components/ui/badge";
import { TimetableConstraint, CONSTRAINT_TYPE_LABELS } from "../../types";
import { Shield, ShieldAlert, Check, X } from "lucide-react";

export const timetableConstraintColumns: ColumnConfig<TimetableConstraint>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (value: any) => <span className="font-medium">{value}</span>,
  },
  {
    key: "timetable_name",
    header: "Timetable",
    sortable: true,
  },
  {
    key: "constraint_type",
    header: "Type",
    sortable: true,
    render: (value: any) => (
      <Badge variant="outline">
        {CONSTRAINT_TYPE_LABELS[value as keyof typeof CONSTRAINT_TYPE_LABELS] || value}
      </Badge>
    ),
  },
  {
    key: "is_hard_constraint",
    header: "Constraint Level",
    render: (value: any) => (
      <Badge
        variant={value ? "destructive" : "secondary"}
        className="flex items-center gap-1 w-fit"
      >
        {value ? (
          <>
            <ShieldAlert className="h-3 w-3" />
            Hard
          </>
        ) : (
          <>
            <Shield className="h-3 w-3" />
            Soft
          </>
        )}
      </Badge>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
  },
  {
    key: "weight",
    header: "Weight",
    sortable: true,
  },
  {
    key: "is_active",
    header: "Active",
    render: (value: any) =>
      value ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
];
