/**
 * UserSession Actions Configuration
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { UserSession } from '../../types';
import { userSessionActions } from '../api/client';
import { XCircle } from 'lucide-react';

export const UserSessionActionsConfig: EntityActionsConfig<UserSession> = {
  actions: [
    {
      id: 'expire',
      label: 'Expire Session',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (session?: UserSession) =>
        `Are you sure you want to expire this session?`,
      confirmText: 'Expire',
      onConfirm: async (session?: UserSession, context?) => {
        if (!session || !context?.refresh) return;
        try {
          await userSessionActions.expire(session.id);
          console.log('Session expired:', session.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to expire session:', error);
        }
      },
    },
  ],
};
