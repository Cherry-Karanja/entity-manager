/**
 * UserSession API Client
 * 
 * API client for Django user-sessions endpoint.
 */

import { createHttpClient } from '@/components/entityManager';
import { UserSession } from '../../types';

export const userSessionsApiClient = createHttpClient<UserSession>({
  endpoint: '/api/v1/accounts/user-sessions/',
});

export const userSessionActions = {
  async expire(id: string | number) {
    return userSessionsApiClient.customAction(id, 'expire', undefined, 'POST');
  },
  async expireAll() {
    return userSessionsApiClient.customAction(undefined, 'expire-all', undefined, 'POST');
  },
  async activeCount() {
    return userSessionsApiClient.customAction(undefined, 'active-count', undefined, 'GET');
  },
};
