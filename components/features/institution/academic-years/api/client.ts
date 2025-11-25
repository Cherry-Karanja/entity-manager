/**
 * Academic Year API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { AcademicYear } from '../../types';

export const academicYearsApiClient = createHttpClient<AcademicYear>({
  endpoint: '/api/v1/institution/academic-years/',
});

export const academicYearActions = {
  activate: async (id: string) => academicYearsApiClient.customAction(id, 'activate'),
  deactivate: async (id: string) => academicYearsApiClient.customAction(id, 'deactivate'),
  getCurrent: async () => academicYearsApiClient.customAction('', 'current'),
};
