/**
 * Enrollment Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';
import { Trash2, CheckCircle, XCircle, GraduationCap, UserMinus } from 'lucide-react';
import { enrollmentActions as apiActions } from '../api/client';

export const EnrollmentActionsConfig: EntityActionsConfig<Enrollment> = {
  actions: [
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'action',
      variant: 'default',
      position: 'row',
      visible: (enrollment?: Enrollment) => !enrollment?.is_active,
      onAction: async (enrollment?: Enrollment, context?) => {
        if (!enrollment || !context?.refresh) return;
        await apiActions.activate(enrollment.id);
        await context.refresh();
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'action',
      variant: 'secondary',
      position: 'row',
      visible: (enrollment?: Enrollment) => enrollment?.is_active === true,
      onAction: async (enrollment?: Enrollment, context?) => {
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
      visible: (enrollment?: Enrollment) => enrollment?.status === 'active' || enrollment?.status === 'completed',
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      icon: <UserMinus className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (enrollment?: Enrollment) => enrollment?.status === 'active',
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

  bulkActions: [
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'action',
      variant: 'default',
      onAction: async (items?: Enrollment[], context?) => {
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
};
