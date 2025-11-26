/**
 * Intake API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Intake } from '../../types';

export const intakesApiClient = createHttpClient<Intake, {
  activate: Intake;
  deactivate: Intake;
  close: Intake;
}>({
  endpoint: '/api/v1/institution/intakes/',
});

export const intakeActions = {
  activate: async (id: string) => intakesApiClient.customAction(id, 'activate'),
  deactivate: async (id: string) => intakesApiClient.customAction(id, 'deactivate'),
  close: async (id: string) => intakesApiClient.customAction(id, 'close'),
};
