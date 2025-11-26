/**
 * Department Action Configurations
 * 
 * Defines actions available for department management.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Department } from '../../types';
import { 
  Trash2,
  Download,
} from 'lucide-react';
import { departmentsApiClient } from '../../departments/api/client';

export const DepartmentActionsConfig: EntityActionsConfig<Department> = {
  actions: [
    {
      id: 'delete',
      label: 'Delete Department',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (dept?: Department) =>
        `Are you sure you want to delete "${dept?.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async (dept?: Department, context?) => {
        if (!dept) return;
        try {
          await departmentsApiClient.delete(dept.id);
          await context?.refresh?.();
        } catch (error) {
          console.error('Failed to delete department:', error);
        }
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'bulk',
      position: 'toolbar',
      variant: 'destructive',
      confirmMessage: (items?: Department[]) =>
        `Are you sure you want to delete ${items?.length || 0} departments? This action cannot be undone.`,
      requireConfirm: true,
      handler: async (items?: Department[], context?: any) => {
        if (!items?.length) return;
        try {
          const ids = items.map(d => d.id);
          await Promise.all(ids.map(id => departmentsApiClient.delete(id)));
          await context?.refresh?.();
        } catch (error) {
          console.error('Failed to bulk delete departments:', error);
        }
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: <Download className="h-4 w-4" />,
      actionType: 'bulk',
      position: 'toolbar',
      variant: 'secondary',
      handler: async (items?: Department[]) => {
        console.log('Export departments:', items);
      },
    },
  ],
};
