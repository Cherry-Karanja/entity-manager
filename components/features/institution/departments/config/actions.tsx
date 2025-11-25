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
  UserPlus,
  UserMinus,
} from 'lucide-react';

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
        if (!dept || !context?.delete || !context?.refresh) return;
        try {
          await context.delete(dept.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to delete department:', error);
        }
      },
    },
  ],

  bulkActions: [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      confirmMessage: (items?: Department[]) => 
        `Are you sure you want to delete ${items?.length || 0} departments? This action cannot be undone.`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Department[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        try {
          const ids = items.map(d => d.id);
          await context.bulkDelete(ids);
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk delete departments:', error);
        }
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: <Download className="h-4 w-4" />,
      actionType: 'custom',
      variant: 'secondary',
      onAction: async (items?: Department[]) => {
        console.log('Export departments:', items);
      },
    },
  ],
};
