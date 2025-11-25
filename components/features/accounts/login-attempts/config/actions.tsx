/**
 * LoginAttempt Actions Configuration
 * 
 * Login attempts are read-only audit logs, so minimal actions are needed.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { LoginAttempt } from '../../types';

export const LoginAttemptActionsConfig: EntityActionsConfig<LoginAttempt> = {
  actions: [],
};
