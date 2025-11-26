import type { EntityActionsConfig } from "@/components/entityManager/composition/config/types";
import type { ActionContext } from "@/components/entityManager/components/actions/types";
import { VirtualResource } from "../../types";
import { Eye, Pencil, Trash2, Calendar, Power, PowerOff, Copy } from "lucide-react";

export const virtualResourceActionsConfig: EntityActionsConfig<VirtualResource> = {
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
      label: "Edit Resource",
      icon: <Pencil className="h-4 w-4" />,
      actionType: "navigation",
      position: "row",
    },
    {
      id: "toggle_active",
      label: (item?: VirtualResource) => (item?.is_active ? "Deactivate" : "Activate"),
      icon: (item?: VirtualResource) =>
        item?.is_active ? (
          <PowerOff className="h-4 w-4" />
        ) : (
          <Power className="h-4 w-4" />
        ),
      actionType: "confirm",
      variant: "outline",
      position: "row",
      confirmMessage: (item?: VirtualResource) =>
        `Are you sure you want to ${item?.is_active ? "deactivate" : "activate"} this resource?`,
      onConfirm: async (item?: VirtualResource, context?: ActionContext<VirtualResource>): Promise<void> => {
        if (!item) return;
        const apiClient = (context as any)?.api;
        if (!apiClient?.update) return;
        await apiClient.update(item.id, { is_active: !item.is_active });
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "check_availability",
      label: "Check Availability",
      icon: <Calendar className="h-4 w-4" />,
      actionType: "custom",
      position: "row",
      handler: async (item?: VirtualResource, context?: ActionContext<VirtualResource>): Promise<void> => {
        await (context as any)?.showDialog?.({
          title: "Check Resource Availability",
          content: `Select date and time to check availability for: ${item?.name}`,
        });
      },
    },
    {
      id: "duplicate",
      label: "Duplicate Resource",
      icon: <Copy className="h-4 w-4" />,
      actionType: "custom",
      position: "row",
      handler: async (item?: VirtualResource, context?: ActionContext<VirtualResource>): Promise<void> => {
        if (!item) return;
        const apiClient = (context as any)?.api;
        if (!apiClient?.create) return;
        const { ...data } = item;
        await apiClient.create({
          ...data,
          name: `${item.name} (Copy)`,
          code: `${item.code}-COPY`,
        });
        await Promise.resolve(context?.refresh?.());
      },
    },
    {
      id: "delete",
      label: "Delete Resource",
      icon: <Trash2 className="h-4 w-4" />,
      actionType: "confirm",
      variant: "destructive",
      position: "row",
      confirmMessage: (item?: VirtualResource) =>
        `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
      onConfirm: async (item?: VirtualResource, context?: ActionContext<VirtualResource>): Promise<void> => {
        if (!item) return;
        const apiClient = (context as any)?.api;
        if (!apiClient?.delete) return;
        await apiClient.delete(item.id);
        await Promise.resolve(context?.refresh?.());
      },
    },
  ],
};

export default virtualResourceActionsConfig;
