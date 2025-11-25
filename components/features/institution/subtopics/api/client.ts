/**
 * Subtopic API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Subtopic } from '../../types';

export const subtopicsApiClient = createHttpClient<Subtopic>({
  endpoint: '/api/v1/academics/subtopics/',
});

export const subtopicActions = {
  reorder: async (id: string, newOrder: number) => 
    subtopicsApiClient.customAction(id, 'reorder', { method: 'POST', body: { order: newOrder } }),
  markComplete: async (id: string) => subtopicsApiClient.customAction(id, 'complete'),
};
