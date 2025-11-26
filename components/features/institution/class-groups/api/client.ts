/**
 * ClassGroup API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { ClassGroup } from '../../types';

export const classGroupsApiClient = createHttpClient<ClassGroup, {
  activate: ClassGroup;
  deactivate: ClassGroup;
  add_trainee: ClassGroup;
  remove_trainee: ClassGroup;
}>({
  endpoint: '/api/v1/institution/class-groups/',
});

export const classGroupActions = {
  activate: async (id: string) => classGroupsApiClient.customAction(id, 'activate'),
  deactivate: async (id: string) => classGroupsApiClient.customAction(id, 'deactivate'),
  addTrainee: async (id: string, userId: string) => 
    classGroupsApiClient.customAction(id, 'add_trainee', { user_id: userId }),
  removeTrainee: async (id: string, userId: string) => 
    classGroupsApiClient.customAction(id, 'remove_trainee', { user_id: userId }),
};
