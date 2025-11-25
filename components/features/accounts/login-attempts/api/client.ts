/**
 * LoginAttempt API Client
 * 
 * API client for Django login-attempts endpoint.
 */

import { createHttpClient } from '@/components/entityManager';
import { LoginAttempt } from '../../types';

export const loginAttemptsApiClient = createHttpClient<LoginAttempt>({
  endpoint: '/api/v1/accounts/login-attempts/',
});
