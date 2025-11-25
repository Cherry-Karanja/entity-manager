/**
 * Enrollment API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Enrollment } from '../../types';

export const enrollmentsApiClient = createHttpClient<Enrollment>({
  endpoint: '/api/v1/academics/enrollments/',
});

export const enrollmentActions = {
  activate: async (id: string) => enrollmentsApiClient.customAction(id, 'activate'),
  deactivate: async (id: string) => enrollmentsApiClient.customAction(id, 'deactivate'),
  updateGrade: async (id: string, grade: string) => 
    enrollmentsApiClient.customAction(id, 'update-grade', { method: 'POST', body: { grade } }),
  withdraw: async (id: string, reason?: string) => 
    enrollmentsApiClient.customAction(id, 'withdraw', { method: 'POST', body: { reason } }),
};
