import { EntityActionsConfig } from "@/components/entityManager/composition/config/types";
import { TimetableConstraint } from "../../types";
import { Eye, Pencil, Trash2, CheckCircle, AlertTriangle, Power } from "lucide-react";
import { timetableConstraintApi } from "../api/client";

export const timetableConstraintActionsConfig: EntityActionsConfig<TimetableConstraint> = {
  actions: [
    {
      id: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      actionType: "navigation",
      position: 'row',
      // If you have a route for viewing constraint, set url here
    },
    {
      id: "edit",
      label: "Edit Constraint",
      icon: <Pencil className="h-4 w-4" />,
      actionType: "navigation",
      position: 'row',
    },
    {
      id: "toggle_active",
      label: "Toggle Active",
      icon: <Power className="h-4 w-4" />,
      actionType: "confirm",
      position: 'row',
      confirmMessage: (item?: TimetableConstraint) =>
        `Are you sure you want to ${item?.is_active ? 'deactivate' : 'activate'} "${item?.name}"?`,
      onConfirm: async (item?: TimetableConstraint, context?: any) => {
        if (!item) return;
        await timetableConstraintApi.update(item.id, { is_active: !item.is_active });
        await context?.refresh?.();
      },
    },
    {
      id: "validate",
      label: "Validate Parameters",
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: "immediate",
      position: 'row',
      handler: async (item?: TimetableConstraint, context?: any) => {
        if (!item) return;
        try {
          const result = await timetableConstraintApi.validateParameters(item.id);
          console.log('Validation result', result);
        } catch (err) {
          console.error('Validation failed', err);
        }
      },
    },
    {
      id: "check_violations",
      label: "Check Violations",
      icon: <AlertTriangle className="h-4 w-4" />,
      actionType: "immediate",
      position: 'row',
      handler: async (item?: TimetableConstraint) => {
        // Open a schedule selection UI or trigger check process; keep type-safe for now
        console.log('Trigger check violations for', item?.id);
      },
    },
    {
      id: "delete",
      label: "Delete Constraint",
      icon: <Trash2 className="h-4 w-4" />,
      actionType: "confirm",
      position: 'row',
      variant: "destructive",
      confirmMessage: (item?: TimetableConstraint) =>
        `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
      onConfirm: async (item?: TimetableConstraint, context?: any) => {
        if (!item) return;
        await timetableConstraintApi.delete(item.id);
        await context?.refresh?.();
      },
    },
  ],
};
