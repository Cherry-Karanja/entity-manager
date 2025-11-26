/**
 * UserSession API Client
 * 
 * API client for Django user-sessions endpoint.
 */

import { createHttpClient } from '@/components/entityManager';
import { UserSession } from '../../types';

// Some session actions return numeric stats (e.g., active-count). Annotate the
// client so customAction('stats','active-count') is typed as ApiResponse<number>.
export const userSessionsApiClient = createHttpClient<UserSession, {
  expire: void;
  'expire-all': void;
  'active-count': number;
}>({
  endpoint: '/api/v1/accounts/user-sessions/',
});

export const userSessionActions = {
  async expire(id: string | number) {
    return userSessionsApiClient.customAction(id, 'expire', {});
  },
  async expireAll() {
    return userSessionsApiClient.customAction('bulk', 'expire-all', {});
  },
  async activeCount() {
    return userSessionsApiClient.customAction('stats', 'active-count', undefined);
  },
};
