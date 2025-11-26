/**
 * Unit API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Unit, Topic } from '../../types';

export const unitsApiClient = createHttpClient<Unit, {
  topics: Topic[];
  activate: Unit;
  deactivate: Unit;
  'assign-trainer': Unit;
}>({
  endpoint: '/api/v1/academics/units/',
});

export const unitActions = {
  activate: async (id: string) => unitsApiClient.customAction(id, 'activate'),
  deactivate: async (id: string) => unitsApiClient.customAction(id, 'deactivate'),
  getTopics: async (id: string) => unitsApiClient.customAction(id, 'topics'),
  assignTrainer: async (id: string, trainerId: string) => 
    unitsApiClient.customAction(id, 'assign-trainer', { method: 'POST', body: { trainer_id: trainerId } }),
};
