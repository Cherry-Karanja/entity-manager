import type { ActionsConfig } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";
import { Gauge, ToggleLeft, ToggleRight } from "lucide-react";

export const resourceLimitActionsConfig: ActionsConfig<ResourceLimit> = {
  rowActions: [
    {
      label: "Check Limit",
      icon: Gauge,
      action: "checkLimit",
      variant: "outline",
      requiresConfirmation: false,
      description: "Check if the current limit would be exceeded",
    },
    {
      label: (item) => (item.is_active ? "Deactivate" : "Activate"),
      icon: (item) => (item.is_active ? ToggleRight : ToggleLeft),
      action: "toggleActive",
      variant: "outline",
      requiresConfirmation: true,
      confirmationMessage: (item) =>
        `Are you sure you want to ${item.is_active ? "deactivate" : "activate"} this resource limit?`,
      description: (item) =>
        item.is_active
          ? "Deactivate this resource limit"
          : "Activate this resource limit",
    },
  ],
  bulkActions: [
    {
      label: "Activate Selected",
      action: "bulkActivate",
      variant: "default",
      requiresConfirmation: true,
      confirmationMessage: "Are you sure you want to activate the selected resource limits?",
      description: "Activate multiple resource limits at once",
    },
    {
      label: "Deactivate Selected",
      action: "bulkDeactivate",
      variant: "secondary",
      requiresConfirmation: true,
      confirmationMessage: "Are you sure you want to deactivate the selected resource limits?",
      description: "Deactivate multiple resource limits at once",
    },
    {
      label: "Delete Selected",
      action: "bulkDelete",
      variant: "destructive",
      requiresConfirmation: true,
      confirmationMessage: "Are you sure you want to delete the selected resource limits? This action cannot be undone.",
      description: "Delete multiple resource limits at once",
    },
  ],
  handlers: {
    checkLimit: async (item, client) => {
      if (client.customActions?.checkLimit) {
        const result = await client.customActions.checkLimit(item.id);
        return {
          success: true,
          message: result.within_limit 
            ? `Within limit: ${result.current_usage}/${result.max_value} ${result.resource_type}`
            : `Exceeds limit: ${result.current_usage}/${result.max_value} ${result.resource_type}`,
          data: result,
        };
      }
      throw new Error("Check limit action not available");
    },
    toggleActive: async (item, client) => {
      const updated = await client.update(item.id, {
        is_active: !item.is_active,
      });
      return {
        success: true,
        message: `Resource limit ${updated.is_active ? "activated" : "deactivated"} successfully`,
        data: updated,
      };
    },
    bulkActivate: async (items, client) => {
      const results = await Promise.all(
        items.map((item) => client.update(item.id, { is_active: true }))
      );
      return {
        success: true,
        message: `${results.length} resource limit(s) activated successfully`,
        data: results,
      };
    },
    bulkDeactivate: async (items, client) => {
      const results = await Promise.all(
        items.map((item) => client.update(item.id, { is_active: false }))
      );
      return {
        success: true,
        message: `${results.length} resource limit(s) deactivated successfully`,
        data: results,
      };
    },
    bulkDelete: async (items, client) => {
      await Promise.all(items.map((item) => client.delete(item.id)));
      return {
        success: true,
        message: `${items.length} resource limit(s) deleted successfully`,
      };
    },
  },
};

export default resourceLimitActionsConfig;
