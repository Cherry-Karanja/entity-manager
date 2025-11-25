/**
 * Intake Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Intake } from '../../types';
import { intakeActions as apiActions } from '../api/client';
import { Trash2, CheckCircle, Lock } from 'lucide-react';

export const IntakeActionsConfig: EntityActionsConfig<Intake> = {
  actions: [
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (intake?: Intake) => !intake?.is_active,
      confirmMessage: (intake?: Intake) => `Activate intake "${intake?.name}"?`,
      confirmText: 'Activate',
      onConfirm: async (intake?: Intake, context?) => {
        if (!intake || !context?.refresh) return;
        await apiActions.activate(intake.id);
        await context.refresh();
      },
    },
    {
      id: 'close',
      label: 'Close Intake',
      icon: <Lock className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (intake?: Intake) => intake?.is_active === true,
      confirmMessage: (intake?: Intake) => `Close intake "${intake?.name}"? This will prevent new enrollments.`,
      confirmText: 'Close',
      onConfirm: async (intake?: Intake, context?) => {
        if (!intake || !context?.refresh) return;
        await apiActions.close(intake.id);
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
      confirmMessage: (intake?: Intake) => `Delete intake "${intake?.name}"?`,
      confirmText: 'Delete',
      onConfirm: async (intake?: Intake, context?) => {
        if (!intake || !context?.delete || !context?.refresh) return;
        await context.delete(intake.id);
        await context.refresh();
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
      confirmMessage: (items?: Intake[]) => `Delete ${items?.length || 0} intakes?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Intake[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(i => i.id));
        await context.refresh();
      },
    },
  ],
};
