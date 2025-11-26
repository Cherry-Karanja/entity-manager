import { ColumnConfig } from "@/components/entityManager";
import { Badge } from "@/components/ui/badge";
import { TimetableSettings } from "../../types";
import { Star, Check, X } from "lucide-react";

export const timetableSettingsColumns: ColumnConfig<TimetableSettings>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (value: any, item?: TimetableSettings) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {item?.is_default && (
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        )}
      </div>
    ),
  },
  {
    key: "institution_name",
    header: "Institution",
    sortable: true,
  },
  {
    key: "max_lessons_per_day",
    header: "Max Lessons/Day",
    sortable: true,
  },
  {
    key: "max_consecutive_lessons",
    header: "Max Consecutive",
    sortable: true,
  },
  {
    key: "min_break_duration",
    header: "Min Break (min)",
    sortable: true,
  },
  {
    key: "balance_daily_load",
    header: "Balance Load",
      render: (value: any) =>
        value ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
  {
    key: "avoid_gaps",
    header: "Avoid Gaps",
      render: (value: any) =>
        value ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
  {
    key: "is_default",
    header: "Status",
    render: (value: any) => (
        <Badge variant={value ? "default" : "secondary"}>
        {value ? "Default" : "Custom"}
      </Badge>
    ),
  },
];
