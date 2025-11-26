/**
 * Enrollment Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';
import { Trash2, CheckCircle, XCircle, GraduationCap, UserMinus } from 'lucide-react';
import { enrollmentActions as apiActions } from '../api/client';

export const EnrollmentActionsConfig: EntityActionsConfig<Enrollment> = ({
  actions: [
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'default',
      position: 'row',
      visible: (enrollment?: Enrollment) => !enrollment?.is_active,
      handler: async (enrollment?: Enrollment, context?: any) => {
        if (!enrollment || !context?.refresh) return;
        await apiActions.activate(enrollment.id);
        await context.refresh();
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'secondary',
      position: 'row',
      visible: (enrollment?: Enrollment) => enrollment?.is_active === true,
      handler: async (enrollment?: Enrollment, context?: any) => {
        if (!enrollment || !context?.refresh) return;
        await apiActions.deactivate(enrollment.id);
        await context.refresh();
      },
    },
    {
      id: 'update-grade',
      label: 'Update Grade',
      icon: <GraduationCap className="h-4 w-4" />,
      actionType: 'modal',
      variant: 'outline',
      position: 'row',
      visible: (enrollment?: Enrollment) => enrollment?.is_active === true || enrollment?.status === 'completed',
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      icon: <UserMinus className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (enrollment?: Enrollment) => enrollment?.is_active === true,
      confirmMessage: (enrollment?: Enrollment) => `Withdraw "${enrollment?.trainee_name}" from this class?`,
      confirmText: 'Withdraw',
      onConfirm: async (enrollment?: Enrollment, context?) => {
        if (!enrollment || !context?.refresh) return;
        await apiActions.withdraw(enrollment.id);
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
      confirmMessage: (enrollment?: Enrollment) => `Delete enrollment for "${enrollment?.trainee_name}"?`,
      confirmText: 'Delete',
      onConfirm: async (enrollment?: Enrollment, context?) => {
        if (!enrollment || !context?.delete || !context?.refresh) return;
        await context.delete(enrollment.id);
        await context.refresh();
      },
    },
  ],

  bulk: [
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'default',
      handler: async (items?: Enrollment[], context?: any) => {
        if (!items?.length || !context?.refresh) return;
        await Promise.all(items.map(e => apiActions.activate(e.id)));
        await context.refresh();
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      confirmMessage: (items?: Enrollment[]) => `Delete ${items?.length || 0} enrollments?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Enrollment[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(e => e.id));
        await context.refresh();
      },
    },
  ],
} as any) as EntityActionsConfig<Enrollment>;
