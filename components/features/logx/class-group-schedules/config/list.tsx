import type { Column } from "@/components/entityManager/components/list/types";
import { Badge } from "@/components/ui/badge";
import { ClassGroupSchedule, DAY_OF_WEEK_LABELS } from "../../types";
import { Lock, Unlock } from "lucide-react";

export const classGroupScheduleColumns: Column<ClassGroupSchedule>[] = [
  {
    key: "class_group_name",
    label: "Class Group",
    sortable: true,
    render: (value: any, row?: ClassGroupSchedule, index?: number) => <span className="font-medium">{value || "—"}</span>,
  },
  {
    key: "unit_name",
    label: "Unit",
    sortable: true,
  },
  {
    key: "instructor_name",
    label: "Instructor",
    sortable: true,
  },
  {
    key: "room_name",
    label: "Room",
    sortable: true,
  },
  {
    key: "day_of_week",
    label: "Day",
    sortable: true,
    render: (value: any, row?: ClassGroupSchedule, index?: number) => (
      <Badge variant="outline">{String(DAY_OF_WEEK_LABELS[value as keyof typeof DAY_OF_WEEK_LABELS] || value)}</Badge>
    ),
  },
  {
    key: "start_time",
    label: "Start Time",
    sortable: true,
    render: (value: any, row?: ClassGroupSchedule, index?: number) => {
      if (!value) return "—";
      const [hours, minutes] = (value as string).split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    },
  },
  {
    key: "end_time",
    label: "End Time",
    sortable: true,
    render: (value: any, row?: ClassGroupSchedule, index?: number) => {
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
    label: "Status",
    render: (value: any, row?: ClassGroupSchedule, index?: number) => (
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
