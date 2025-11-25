/**
 * Unit Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Unit } from '../../types';
import { unitActions as apiActions } from '../api/client';
import { Trash2, CheckCircle, XCircle, BookOpen } from 'lucide-react';

export const UnitActionsConfig: EntityActionsConfig<Unit> = {
  actions: [
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (unit?: Unit) => !unit?.is_active,
      confirmMessage: (unit?: Unit) => `Activate unit "${unit?.name}"?`,
      confirmText: 'Activate',
      onConfirm: async (unit?: Unit, context?) => {
        if (!unit || !context?.refresh) return;
        await apiActions.activate(unit.id);
        await context.refresh();
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (unit?: Unit) => unit?.is_active === true,
      confirmMessage: (unit?: Unit) => `Deactivate unit "${unit?.name}"?`,
      confirmText: 'Deactivate',
      onConfirm: async (unit?: Unit, context?) => {
        if (!unit || !context?.refresh) return;
        await apiActions.deactivate(unit.id);
        await context.refresh();
      },
    },
    {
      id: 'view-topics',
      label: 'View Topics',
      icon: <BookOpen className="h-4 w-4" />,
      actionType: 'navigate',
      variant: 'secondary',
      position: 'row',
      route: (unit?: Unit) => `/dashboard/academics/units/${unit?.id}/topics`,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (unit?: Unit) => `Delete unit "${unit?.name}"? This will also delete all associated topics.`,
      confirmText: 'Delete',
      onConfirm: async (unit?: Unit, context?) => {
        if (!unit || !context?.delete || !context?.refresh) return;
        await context.delete(unit.id);
        await context.refresh();
      },
    },
  ],

  bulkActions: [
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      confirmMessage: (items?: Unit[]) => `Activate ${items?.length || 0} units?`,
      confirmText: 'Activate All',
      onConfirm: async (items?: Unit[], context?) => {
        if (!items?.length || !context?.refresh) return;
        await Promise.all(items.map(u => apiActions.activate(u.id)));
        await context.refresh();
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      confirmMessage: (items?: Unit[]) => `Delete ${items?.length || 0} units and their topics?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Unit[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(u => u.id));
        await context.refresh();
      },
    },
  ],
};
