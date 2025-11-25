import { ActionConfig } from "@/components/entityManager";
import { PenaltyRule } from "../../types";
import { Eye, Pencil, Trash2, Calculator, Power, PowerOff, Copy } from "lucide-react";

export const penaltyRuleActions: ActionConfig<PenaltyRule>[] = [
  {
    key: "view",
    label: "View Details",
    icon: <Eye className="h-4 w-4" />,
    type: "view",
  },
  {
    key: "edit",
    label: "Edit Rule",
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
    key: "calculate_penalty",
    label: "Calculate Penalty",
    icon: <Calculator className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { showDialog }) => {
      showDialog?.({
        title: "Calculate Penalty",
        content: `Configure violations to calculate penalty using rule: ${item.name}`,
        // This would open a dialog to input violations
      });
    },
  },
  {
    key: "duplicate",
    label: "Duplicate Rule",
    icon: <Copy className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { api, refresh }) => {
      const { ...data } = item;
      await api.create({
        ...data,
        name: `${item.name} (Copy)`,
      });
      refresh?.();
    },
  },
  {
    key: "delete",
    label: "Delete Rule",
    icon: <Trash2 className="h-4 w-4" />,
    type: "delete",
    variant: "destructive",
    confirmMessage: (item) =>
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
  },
];
