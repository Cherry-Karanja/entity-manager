import { Action } from "@/components/entityManager/components/actions/types";
import { TimetableSettings } from "../../types";
import { Eye, Pencil, Trash2, Star, Copy } from "lucide-react";
import { timetableSettingsApi } from "../api/client";

export const timetableSettingsActions: Action<TimetableSettings>[] = [
  {
    id: "view",
    label: "View Details",
    actionType: "navigation",
    icon: <Eye className="h-4 w-4" />,
    // navigation URL builder - update if your routes differ
    url: (entity) => `/dashboard/(scheduling)/timetable-settings/${entity?.id}`,
    position: "row",
  },
  {
    id: "edit",
    label: "Edit Settings",
    actionType: "navigation",
    icon: <Pencil className="h-4 w-4" />,
    url: (entity) => `/dashboard/(scheduling)/timetable-settings/${entity?.id}/edit`,
    position: "row",
  },
  {
    id: "set_default",
    label: "Set as Default",
    actionType: "immediate",
    icon: <Star className="h-4 w-4" />,
    position: "row",
    visible: (entity) => !entity?.is_default,
    handler: async (entity, context) => {
      if (!entity) return;
      await timetableSettingsApi.update(entity.id, { is_default: true });
      await context?.refresh?.();
    },
  },
  {
    id: "duplicate",
    label: "Duplicate Settings",
    actionType: "immediate",
    icon: <Copy className="h-4 w-4" />,
    position: "row",
    handler: async (entity, context) => {
      if (!entity) return;
      const { id: _id, ...data } = entity as any;
      await timetableSettingsApi.create({
        ...data,
        name: `${entity.name} (Copy)`,
        is_default: false,
      });
      await context?.refresh?.();
    },
  },
  {
    id: "delete",
    label: "Delete Settings",
    actionType: "confirm",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
    position: "row",
    visible: (entity) => !entity?.is_default,
    confirmMessage: (entity) =>
      `Are you sure you want to delete "${entity?.name}"? This action cannot be undone.`,
    onConfirm: async (entity, context) => {
      if (!entity) return;
      await timetableSettingsApi.delete(entity.id);
      await context?.refresh?.();
    },
  },
];
