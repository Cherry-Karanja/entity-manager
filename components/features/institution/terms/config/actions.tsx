/**
 * Term Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Term } from '../../types';
import { termActions as apiActions } from '../api/client';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

export const TermActionsConfig: EntityActionsConfig<Term> = {
  actions: [
    {
      id: 'activate',
      label: 'Set as Active',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (term?: Term) => !term?.is_active,
      confirmMessage: (term?: Term) => `Set Term ${term?.term_number} as the active term?`,
      confirmText: 'Activate',
      onConfirm: async (term?: Term, context?) => {
        if (!term || !context?.refresh) return;
        await apiActions.activate(term.id);
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
      visible: (term?: Term) => term?.is_active === true,
      confirmMessage: (term?: Term) => `Deactivate Term ${term?.term_number}?`,
      confirmText: 'Deactivate',
      onConfirm: async (term?: Term, context?) => {
        if (!term || !context?.refresh) return;
        await apiActions.deactivate(term.id);
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
      confirmMessage: (term?: Term) => `Delete Term ${term?.term_number}?`,
      confirmText: 'Delete',
      onConfirm: async (term?: Term, context?) => {
        if (!term || !context?.delete || !context?.refresh) return;
        await context.delete(term.id);
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
      confirmMessage: (items?: Term[]) => `Delete ${items?.length || 0} terms?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Term[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(t => t.id));
        await context.refresh();
      },
    },
  ],
};
