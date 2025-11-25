/**
 * UserSession Actions Configuration
 */

import { ConfirmAction } from '@/components/entityManager/components/actions/types';
import { UserSession } from '../../types';
import { userSessionActions } from '../api/client';

export const expireSessionAction: ConfirmAction<UserSession> = {
  id: 'expire',
  label: 'Expire Session',
  actionType: 'confirm',
  icon: 'XCircle',
  variant: 'destructive',
  position: 'row',
  requiresSelection: true,
  confirmMessage: 'Are you sure you want to expire this session?',
  confirmText: 'Expire',
  cancelText: 'Cancel',
  onConfirm: async (entity) => {
    if (entity?.id) {
      await userSessionActions.expire(entity.id);
    }
  },
};

export const UserSessionActionsConfig = {
  actions: [expireSessionAction],
};
