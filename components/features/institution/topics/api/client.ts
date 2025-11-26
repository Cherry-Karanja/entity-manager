/**
 * Topic API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Topic, Subtopic } from '../../types';

export const topicsApiClient = createHttpClient<Topic, {
  subtopics: Subtopic[];
  reorder: Topic[];
}>({
  endpoint: '/api/v1/academics/topics/',
});

export const topicActions = {
  getSubtopics: async (id: string) => topicsApiClient.customAction(id, 'subtopics'),
  reorder: async (id: string, newOrder: number) => 
    topicsApiClient.customAction(id, 'reorder', { method: 'POST', body: { order: newOrder } }),
};
