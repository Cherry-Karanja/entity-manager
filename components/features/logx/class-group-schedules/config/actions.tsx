import { ActionConfig } from "@/components/entityManager";
import { ClassGroupSchedule } from "../../types";
import { Eye, Pencil, Trash2, Lock, Unlock, AlertTriangle } from "lucide-react";

export const classGroupScheduleActions: ActionConfig<ClassGroupSchedule>[] = [
  {
    key: "view",
    label: "View Details",
    icon: <Eye className="h-4 w-4" />,
    type: "view",
  },
  {
    key: "edit",
    label: "Edit Schedule",
    icon: <Pencil className="h-4 w-4" />,
    type: "edit",
  },
  {
    key: "toggle_lock",
    label: (item) => (item.is_locked ? "Unlock Schedule" : "Lock Schedule"),
    icon: (item) =>
      item.is_locked ? (
        <Unlock className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      ),
    type: "custom",
    handler: async (item, { api, refresh }) => {
      await api.update(item.id, { is_locked: !item.is_locked });
      refresh?.();
    },
  },
  {
    key: "check_conflicts",
    label: "Check Conflicts",
    icon: <AlertTriangle className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { showDialog }) => {
      // This would open a dialog showing conflict analysis
      showDialog?.({
        title: "Conflict Analysis",
        content: `Checking conflicts for schedule: ${item.class_group_name} - ${item.unit_name}`,
      });
    },
  },
  {
    key: "delete",
    label: "Delete Schedule",
    icon: <Trash2 className="h-4 w-4" />,
    type: "delete",
    variant: "destructive",
    confirmMessage: (item) =>
      `Are you sure you want to delete the schedule for "${item.class_group_name} - ${item.unit_name}"? This action cannot be undone.`,
  },
];
