import { ColumnConfig } from "@/components/entityManager";
import { Badge } from "@/components/ui/badge";
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from "../../types";
import { Lock, Unlock } from "lucide-react";

export const classGroupScheduleColumns: ColumnConfig<ClassGroupSchedule>[] = [
  {
    key: "class_group_name",
    header: "Class Group",
    sortable: true,
    render: (value) => <span className="font-medium">{value || "—"}</span>,
  },
  {
    key: "unit_name",
    header: "Unit",
    sortable: true,
  },
  {
    key: "instructor_name",
    header: "Instructor",
    sortable: true,
  },
  {
    key: "room_name",
    header: "Room",
    sortable: true,
  },
  {
    key: "day_of_week",
    header: "Day",
    sortable: true,
    render: (value) => (
      <Badge variant="outline">{DAY_OF_WEEK_LABELS[value as keyof typeof DAY_OF_WEEK_LABELS] || value}</Badge>
    ),
  },
  {
    key: "start_time",
    header: "Start Time",
    sortable: true,
    render: (value) => {
      if (!value) return "—";
      // Format time string (HH:MM:SS to HH:MM AM/PM)
      const [hours, minutes] = (value as string).split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    },
  },
  {
    key: "end_time",
    header: "End Time",
    sortable: true,
    render: (value) => {
      if (!value) return "—";
      const [hours, minutes] = (value as string).split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    },
  },
  {
    key: "is_locked",
    header: "Status",
    render: (value) => (
      <Badge variant={value ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
        {value ? (
          <>
            <Lock className="h-3 w-3" />
            Locked
          </>
        ) : (
          <>
            <Unlock className="h-3 w-3" />
            Unlocked
          </>
        )}
      </Badge>
    ),
  },
];
