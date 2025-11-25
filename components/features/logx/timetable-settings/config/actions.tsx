import { ActionConfig } from "@/components/entityManager";
import { TimetableSettings } from "../../types";
import { Eye, Pencil, Trash2, Star, Copy } from "lucide-react";

export const timetableSettingsActions: ActionConfig<TimetableSettings>[] = [
  {
    key: "view",
    label: "View Details",
    icon: <Eye className="h-4 w-4" />,
    type: "view",
  },
  {
    key: "edit",
    label: "Edit Settings",
    icon: <Pencil className="h-4 w-4" />,
    type: "edit",
  },
  {
    key: "set_default",
    label: "Set as Default",
    icon: <Star className="h-4 w-4" />,
    type: "custom",
    hidden: (item) => item.is_default,
    handler: async (item, { api, refresh }) => {
      await api.update(item.id, { is_default: true });
      refresh?.();
    },
  },
  {
    key: "duplicate",
    label: "Duplicate Settings",
    icon: <Copy className="h-4 w-4" />,
    type: "custom",
    handler: async (item, { api, refresh }) => {
      const { id, created_at, updated_at, is_default, ...data } = item;
      await api.create({
        ...data,
        name: `${item.name} (Copy)`,
        is_default: false,
      });
      refresh?.();
    },
  },
  {
    key: "delete",
    label: "Delete Settings",
    icon: <Trash2 className="h-4 w-4" />,
    type: "delete",
    variant: "destructive",
    hidden: (item) => item.is_default,
    confirmMessage: (item) =>
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
  },
];
