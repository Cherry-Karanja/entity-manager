import type { EntityActionsConfig } from "@/components/entityManager/composition/config/types";
import type { ActionContext } from "@/components/entityManager/components/actions/types";
import { PenaltyRule } from "../../types";
import { Eye, Pencil, Trash2, Calculator, Power, PowerOff, Copy } from "lucide-react";

export const penaltyRuleActionsConfig: EntityActionsConfig<PenaltyRule> = {
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
      label: "Edit Rule",
      icon: <Pencil className="h-4 w-4" />,
      actionType: "navigation",
      position: "row",
    },
    {
      id: "toggle_active",
      label: (item?: PenaltyRule) => (item?.is_active ? "Deactivate" : "Activate"),
      icon: (item?: PenaltyRule) =>
        item?.is_active ? (
          <PowerOff className="h-4 w-4" />
        ) : (
          <Power className="h-4 w-4" />
        ),
      actionType: "confirm",
      variant: "outline",
      position: "row",
      confirmMessage: (item?: PenaltyRule) =>
        `Are you sure you want to ${item?.is_active ? "deactivate" : "activate"} this rule?`,
      onConfirm: async (item?: PenaltyRule, context?: ActionContext<PenaltyRule>): Promise<void> => {
        if (!item) return;
        const apiClient = (context as any)?.api;
        if (!apiClient?.update) return;
        await apiClient.update(item.id, { is_active: !item.is_active });
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "calculate_penalty",
      label: "Calculate Penalty",
      icon: <Calculator className="h-4 w-4" />,
      actionType: "custom",
      position: "row",
      handler: async (item?: PenaltyRule, context?: ActionContext<PenaltyRule>): Promise<void> => {
        await (context as any)?.showDialog?.({
          title: "Calculate Penalty",
          content: `Configure violations to calculate penalty using rule: ${item?.name}`,
        });
      },
    },
    {
      id: "duplicate",
      label: "Duplicate Rule",
      icon: <Copy className="h-4 w-4" />,
      actionType: "custom",
      position: "row",
      handler: async (item?: PenaltyRule, context?: ActionContext<PenaltyRule>): Promise<void> => {
        if (!item) return;
        const apiClient = (context as any)?.api;
        if (!apiClient?.create) return;
        const { ...data } = item;
        await apiClient.create({
          ...data,
          name: `${item.name} (Copy)`,
        });
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "delete",
      label: "Delete Rule",
      icon: <Trash2 className="h-4 w-4" />,
      actionType: "confirm",
      variant: "destructive",
      position: "row",
      confirmMessage: (item?: PenaltyRule) =>
        `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
      onConfirm: async (item?: PenaltyRule, context?: ActionContext<PenaltyRule>): Promise<void> => {
        if (!item) return;
        const apiClient = (context as any)?.api;
        if (!apiClient?.delete) return;
        await apiClient.delete(item.id);
        await Promise.resolve(context?.refresh?.());
      },
    },
  ],
};

export default penaltyRuleActionsConfig;
