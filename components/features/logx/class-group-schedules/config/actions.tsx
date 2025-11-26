import type { EntityActionsConfig } from "@/components/entityManager/composition/config/types";
import type { ActionContext } from "@/components/entityManager/components/actions/types";
import { ClassGroupSchedule } from "../../types";
import { Eye, Pencil, Trash2, Lock, Unlock, AlertTriangle } from "lucide-react";

export const classGroupScheduleActionsConfig: EntityActionsConfig<ClassGroupSchedule> = {
  actions: [
    {
      id: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      actionType: "navigation",
      position: "row",
    },
    {
      id: "edit",
      label: "Edit Schedule",
      icon: <Pencil className="h-4 w-4" />,
      actionType: "navigation",
      position: "row",
    },
    {
      id: "toggle_lock",
      label: (item?: ClassGroupSchedule) => (item?.is_locked ? "Unlock Schedule" : "Lock Schedule"),
      icon: (item?: ClassGroupSchedule) =>
        item?.is_locked ? (
          <Unlock className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        ),
      actionType: "confirm",
      variant: "outline",
      position: "row",
      confirmMessage: (item?: ClassGroupSchedule) =>
        `Are you sure you want to ${item?.is_locked ? "unlock" : "lock"} the schedule for "${item?.class_group_name} - ${item?.unit_name}"?`,
      onConfirm: async (
        item?: ClassGroupSchedule,
        context?: ActionContext<ClassGroupSchedule>
      ): Promise<void> => {
        if (!item) return;
        const api = (context as any)?.api;
        if (!api?.update) return;
        await api.update(item.id, { is_locked: !item.is_locked });
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "check_conflicts",
      label: "Check Conflicts",
      icon: <AlertTriangle className="h-4 w-4" />,
      actionType: "custom",
      position: "row",
      handler: async (item?: ClassGroupSchedule, context?: ActionContext<ClassGroupSchedule>): Promise<void> => {
        await (context as any)?.showDialog?.({
          title: "Conflict Analysis",
          content: `Checking conflicts for schedule: ${item?.class_group_name} - ${item?.unit_name}`,
        });
      },
    },
    {
      id: "delete",
      label: "Delete Schedule",
      icon: <Trash2 className="h-4 w-4" />,
      actionType: "confirm",
      variant: "destructive",
      position: "row",
      confirmMessage: (item?: ClassGroupSchedule) =>
        `Are you sure you want to delete the schedule for "${item?.class_group_name} - ${item?.unit_name}"? This action cannot be undone.`,
      onConfirm: async (item?: ClassGroupSchedule, context?: ActionContext<ClassGroupSchedule>): Promise<void> => {
        if (!item) return;
        const api = (context as any)?.api;
        if (!api?.delete) return;
        await api.delete(item.id);
        await Promise.resolve(context?.refresh?.());
      },
    },
  ],
};

export default classGroupScheduleActionsConfig;
