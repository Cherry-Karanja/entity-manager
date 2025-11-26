/**
 * Term API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Term } from '../../types';

export const termsApiClient = createHttpClient<Term, {
  activate: Term;
  deactivate: Term;
  current: Term;
}>({
  endpoint: '/api/v1/institution/terms/',
});

export const termActions = {
  activate: async (id: string) => termsApiClient.customAction(id, 'activate'),
  deactivate: async (id: string) => termsApiClient.customAction(id, 'deactivate'),
  getCurrent: async () => termsApiClient.customAction('', 'current'),
};
