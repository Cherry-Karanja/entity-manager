/**
 * Academic Year Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { AcademicYear } from '../../types';
import { academicYearActions as apiActions } from '../api/client';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

export const AcademicYearActionsConfig: EntityActionsConfig<AcademicYear> = {
  actions: [
    {
      id: 'activate',
      label: 'Set as Active',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (ay?: AcademicYear) => !ay?.is_active,
      confirmMessage: (ay?: AcademicYear) => `Set ${ay?.year} as the active academic year?`,
      confirmText: 'Activate',
      onConfirm: async (ay?: AcademicYear, context?) => {
        if (!ay || !context?.refresh) return;
        await apiActions.activate(ay.id);
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
      visible: (ay?: AcademicYear) => ay?.is_active === true,
      confirmMessage: (ay?: AcademicYear) => `Deactivate academic year ${ay?.year}?`,
      confirmText: 'Deactivate',
      onConfirm: async (ay?: AcademicYear, context?) => {
        if (!ay || !context?.refresh) return;
        await apiActions.deactivate(ay.id);
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
      confirmMessage: (ay?: AcademicYear) => `Delete academic year ${ay?.year}?`,
      confirmText: 'Delete',
      onConfirm: async (ay?: AcademicYear, context?) => {
        if (!ay || !context?.delete || !context?.refresh) return;
        await context.delete(ay.id);
        await context.refresh();
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'destructive',
      bulkConfirmMessage: (count: number) => `Delete ${count || 0} academic years?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: AcademicYear[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(a => a.id));
        await context.refresh();
      },
    },
  ],
};
