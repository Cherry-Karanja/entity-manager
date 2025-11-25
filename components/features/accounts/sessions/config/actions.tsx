/**
 * UserSession Actions Configuration
 */

import { EntityAction } from '@/components/entityManager/composition/config/types';
import { UserSession } from '../../types';

export const UserSessionActionsConfig: EntityAction<UserSession>[] = [
  {
    name: 'expire',
    label: 'Expire Session',
    icon: 'XCircle',
    variant: 'destructive',
    requiresSelection: true,
    confirmationMessage: 'Are you sure you want to expire this session?',
    scope: 'row',
  },
];
