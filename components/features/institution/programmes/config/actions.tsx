/**
 * Programme Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Programme } from '../../types';
import { Trash2, Download } from 'lucide-react';

export const ProgrammeActionsConfig: EntityActionsConfig<Programme> = {
  actions: [
    {
      id: 'delete',
      label: 'Delete Programme',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (prog?: Programme) => 
        `Are you sure you want to delete "${prog?.name}"?`,
      confirmText: 'Delete',
      onConfirm: async (prog?: Programme, context?) => {
        if (!prog || !context?.delete || !context?.refresh) return;
        await context.delete(prog.id);
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
      confirmMessage: (items?: Programme[]) => 
        `Delete ${items?.length || 0} programmes?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Programme[], context?: any) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(p => p.id));
        await context.refresh();
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: <Download className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'secondary',
      handler: async (items?: Programme[]) => {
        console.log('Export programmes:', items);
      },
    },
  ],
};
