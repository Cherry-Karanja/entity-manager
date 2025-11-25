import { ActionConfig } from "@/components/entityManager";
import { VirtualResource } from "../../types";
import { Eye, Pencil, Trash2, Calendar, Power, PowerOff, Copy } from "lucide-react";

export const virtualResourceActions: ActionConfig<VirtualResource>[] = [
  {
    key: "view",
    label: "View Details",
    icon: <Eye className="h-4 w-4" />,
    type: "view",
  },
  {
    key: "edit",
    label: "Edit Resource",
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
    key: "check_availability",
    label: "Check Availability",
    icon: <Calendar className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { showDialog }) => {
      showDialog?.({
        title: "Check Resource Availability",
        content: `Select date and time to check availability for: ${item.name}`,
        // This would open a dialog to select date/time
      });
    },
  },
  {
    key: "duplicate",
    label: "Duplicate Resource",
    icon: <Copy className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { api, refresh }) => {
      const { id, created_at, updated_at, ...data } = item;
      await api.create({
        ...data,
        name: `${item.name} (Copy)`,
        code: `${item.code}-COPY`,
      });
      refresh?.();
    },
  },
  {
    key: "delete",
    label: "Delete Resource",
    icon: <Trash2 className="h-4 w-4" />,
    type: "delete",
    variant: "destructive",
    confirmMessage: (item) =>
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
  },
];
