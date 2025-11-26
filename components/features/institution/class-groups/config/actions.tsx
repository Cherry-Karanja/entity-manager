/**
 * ClassGroup Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroup } from '../../types';
import { classGroupActions as apiActions } from '../api/client';
import { Trash2, Download, CheckCircle, XCircle } from 'lucide-react';

export const ClassGroupActionsConfig: EntityActionsConfig<ClassGroup> = {
  actions: [
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (cg?: ClassGroup) => !cg?.is_active,
      confirmMessage: (cg?: ClassGroup) => `Activate class "${cg?.name}"?`,
      confirmText: 'Activate',
      onConfirm: async (cg?: ClassGroup, context?) => {
        if (!cg || !context?.refresh) return;
        await apiActions.activate(cg.id);
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
      visible: (cg?: ClassGroup) => cg?.is_active === true,
      confirmMessage: (cg?: ClassGroup) => `Deactivate class "${cg?.name}"?`,
      confirmText: 'Deactivate',
      onConfirm: async (cg?: ClassGroup, context?) => {
        if (!cg || !context?.refresh) return;
        await apiActions.deactivate(cg.id);
        await context.refresh();
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (cg?: ClassGroup) => `Delete class "${cg?.name}"?`,
      confirmText: 'Delete',
      onConfirm: async (cg?: ClassGroup, context?) => {
        if (!cg || !context?.delete || !context?.refresh) return;
        await context.delete(cg.id);
        await context.refresh();
      },
    },
  ],

  bulk: [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      confirmMessage: (items?: ClassGroup[]) => `Delete ${items?.length || 0} classes?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: ClassGroup[], context?: any) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(c => c.id));
        await context.refresh();
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: <Download className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'secondary',
      handler: async (items?: ClassGroup[]) => {
        console.log('Export classes:', items);
      },
    },
  ],
};
