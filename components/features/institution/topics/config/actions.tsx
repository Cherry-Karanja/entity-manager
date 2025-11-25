/**
 * Topic Action Configurations
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Topic } from '../../types';
import { Trash2, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { topicActions as apiActions } from '../api/client';

export const TopicActionsConfig: EntityActionsConfig<Topic> = {
  actions: [
    {
      id: 'view-subtopics',
      label: 'View Subtopics',
      icon: <BookOpen className="h-4 w-4" />,
      actionType: 'navigate',
      variant: 'secondary',
      position: 'row',
      route: (topic?: Topic) => `/dashboard/academics/topics/${topic?.id}/subtopics`,
    },
    {
      id: 'move-up',
      label: 'Move Up',
      icon: <ArrowUp className="h-4 w-4" />,
      actionType: 'action',
      variant: 'ghost',
      position: 'row',
      visible: (topic?: Topic) => (topic?.order || 1) > 1,
      onAction: async (topic?: Topic, context?) => {
        if (!topic || !context?.refresh) return;
        await apiActions.reorder(topic.id, (topic.order || 1) - 1);
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
      onAction: async (topic?: Topic, context?) => {
        if (!topic || !context?.refresh) return;
        await apiActions.reorder(topic.id, (topic.order || 1) + 1);
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
      confirmMessage: (topic?: Topic) => `Delete topic "${topic?.name}"? This will also delete all subtopics.`,
      confirmText: 'Delete',
      onConfirm: async (topic?: Topic, context?) => {
        if (!topic || !context?.delete || !context?.refresh) return;
        await context.delete(topic.id);
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
      confirmMessage: (items?: Topic[]) => `Delete ${items?.length || 0} topics and their subtopics?`,
      confirmText: 'Delete All',
      onConfirm: async (items?: Topic[], context?) => {
        if (!items?.length || !context?.bulkDelete || !context?.refresh) return;
        await context.bulkDelete(items.map(t => t.id));
        await context.refresh();
      },
    },
  ],
};
