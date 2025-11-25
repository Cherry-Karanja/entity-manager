import { ActionConfig } from "@/components/entityManager";
import { TimetableConstraint } from "../../types";
import { Eye, Pencil, Trash2, CheckCircle, AlertTriangle, Power, PowerOff } from "lucide-react";

export const timetableConstraintActions: ActionConfig<TimetableConstraint>[] = [
  {
    key: "view",
    label: "View Details",
    icon: <Eye className="h-4 w-4" />,
    type: "view",
  },
  {
    key: "edit",
    label: "Edit Constraint",
    icon: <Pencil className="h-4 w-4" />,
    type: "edit",
  },
  {
    key: "toggle_active",
    label: (item) => (item.is_active ? "Deactivate" : "Activate"),
    icon: (item) =>
      item.is_active ? (
        <PowerOff className="h-4 w-4" />
      ) : (
        <Power className="h-4 w-4" />
      ),
    type: "custom",
    handler: async (item, { api, refresh }) => {
      await api.update(item.id, { is_active: !item.is_active });
      refresh?.();
    },
  },
  {
    key: "validate",
    label: "Validate Parameters",
    icon: <CheckCircle className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { customApi, showDialog }) => {
      try {
        const result = await customApi?.validateParameters?.(item.id);
        showDialog?.({
          title: "Validation Result",
          content: result?.is_valid
            ? "Parameters are valid!"
            : `Validation failed: ${result?.errors?.join(", ")}`,
        });
      } catch (error) {
        showDialog?.({
          title: "Validation Error",
          content: "Failed to validate parameters.",
        });
      }
    },
  },
  {
    key: "check_violations",
    label: "Check Violations",
    icon: <AlertTriangle className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { showDialog }) => {
      showDialog?.({
        title: "Check Constraint Violations",
        content: `Select a schedule to check violations for constraint: ${item.name}`,
        // This would open a dialog to select a schedule
      });
    },
  },
  {
    key: "delete",
    label: "Delete Constraint",
    icon: <Trash2 className="h-4 w-4" />,
    type: "delete",
    variant: "destructive",
    confirmMessage: (item) =>
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
  },
];
