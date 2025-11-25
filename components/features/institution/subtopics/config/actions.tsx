/**
 * Subtopic Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Subtopic } from '../../types';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { subtopicActions as apiActions } from '../api/client';

export const SubtopicActionsConfig: EntityActionsConfig<Subtopic> = {
  actions: [
    {
      id: 'move-up',
      label: 'Move Up',
      icon: <ArrowUp className="h-4 w-4" />,
      actionType: 'action',
      variant: 'ghost',
      position: 'row',
      visible: (subtopic?: Subtopic) => (subtopic?.order || 1) > 1,
      onAction: async (subtopic?: Subtopic, context?) => {
        if (!subtopic || !context?.refresh) return;
        await apiActions.reorder(subtopic.id, (subtopic.order || 1) - 1);
        await context.refresh();
      },
    },
    {
      id: 'move-down',
      label: 'Move Down',
      icon: <ArrowDown className="h-4 w-4" />,
      actionType: 'action',
      variant: 'ghost',
      position: 'row',
      onAction: async (subtopic?: Subtopic, context?) => {
        if (!subtopic || !context?.refresh) return;
        await apiActions.reorder(subtopic.id, (subtopic.order || 1) + 1);
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
      confirmMessage: (subtopic?: Subtopic) => `Delete subtopic "${subtopic?.name}"?`,
      confirmText: 'Delete',
      onConfirm: async (subtopic?: Subtopic, context?) => {
        if (!subtopic || !context?.delete || !context?.refresh) return;
        await context.delete(subtopic.id);
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
      confirmMessage: (items?: Subtopic[]) => `Delete ${items?.length || 0} subtopics?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Subtopic[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(s => s.id));
        await context.refresh();
      },
    },
  ],
};
