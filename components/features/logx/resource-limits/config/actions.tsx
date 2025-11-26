import type { EntityActionsConfig } from "@/components/entityManager/composition/config/types";
import type { ActionContext, ActionResult } from "@/components/entityManager/components/actions/types";
import type { ApiClient } from "@/components/entityManager/composition/api/types";
import type { ResourceLimit } from "../../types";
import { Gauge, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * Canonical actions config for resource limits
 * Converted from legacy rowActions/bulkActions/handlers shape to canonical actions array.
 */
export const resourceLimitActionsConfig: EntityActionsConfig<ResourceLimit> = {
  actions: [
    {
      id: "checkLimit",
      label: "Check Limit",
      icon: Gauge,
      actionType: "immediate",
      variant: "outline",
      handler: async (entity?: ResourceLimit, context?: ActionContext<ResourceLimit>): Promise<void> => {
        if (!entity) return;
        // Try known custom hooks on the context (compatibility)
        const client = (context as any)?.customApi ?? (context as any)?.api ?? undefined;
        if (client?.checkLimit) {
          await client.checkLimit(entity.id);
        }
        // do not return structured result - component handles notifications via context
      },
    },
    {
      id: "toggleActive",
      label: (entity?: ResourceLimit) => (entity?.is_active ? "Deactivate" : "Activate"),
      icon: ToggleRight,
      actionType: "confirm",
      variant: "outline",
      confirmMessage: (entity?: ResourceLimit) =>
        `Are you sure you want to ${entity?.is_active ? "deactivate" : "activate"} this resource limit?`,
      onConfirm: async (entity?: ResourceLimit, context?: ActionContext<ResourceLimit>): Promise<void> => {
        if (!entity) return;
        const apiClient = (context as any)?.api as ApiClient<ResourceLimit> | undefined;
        if (!apiClient?.update) return;
        const updatedResp = await apiClient.update(entity.id, { is_active: !entity.is_active });
        const updated = (updatedResp as any)?.data ?? (updatedResp as any);
        await Promise.resolve(context?.refresh?.());
        // no explicit return
      },
    },
    {
      id: "bulkActivate",
      label: "Activate Selected",
      actionType: "bulk",
      variant: "default",
      confirmMessage: "Are you sure you want to activate the selected resource limits?",
      handler: async (items: ResourceLimit[], context?: ActionContext<ResourceLimit>): Promise<void> => {
        const apiClient = (context as any)?.api as ApiClient<ResourceLimit> | undefined;
        if (!apiClient?.update) return;
        await Promise.all(items.map((item) => apiClient.update(item.id, { is_active: true })));
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "bulkDeactivate",
      label: "Deactivate Selected",
      actionType: "bulk",
      variant: "secondary",
      confirmMessage: "Are you sure you want to deactivate the selected resource limits?",
      handler: async (items: ResourceLimit[], context?: ActionContext<ResourceLimit>): Promise<void> => {
        const apiClient = (context as any)?.api as ApiClient<ResourceLimit> | undefined;
        if (!apiClient?.update) return;
        await Promise.all(items.map((item) => apiClient.update(item.id, { is_active: false })));
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "bulkDelete",
      label: "Delete Selected",
      actionType: "bulk",
      variant: "destructive",
      confirmMessage: "Are you sure you want to delete the selected resource limits? This action cannot be undone.",
      handler: async (items: ResourceLimit[], context?: ActionContext<ResourceLimit>): Promise<void> => {
        const apiClient = (context as any)?.api as ApiClient<ResourceLimit> | undefined;
        if (!apiClient?.delete) return;
        await Promise.all(items.map((item) => apiClient.delete(item.id)));
        await Promise.resolve(context?.refresh?.());
      },
    },
  ],
};

export default resourceLimitActionsConfig;
