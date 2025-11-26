/**
 * Department API Client
 * 
 * API client for Django departments endpoint using the HTTP client factory.
 */

import { createHttpClient } from '@/components/entityManager';
import { Department } from '../../types';

/**
 * Departments API Client
 */
export const departmentsApiClient = createHttpClient<Department, {
  assign_hod: Department;
  add_trainer: Department;
  remove_trainer: Department;
}>({
  endpoint: '/api/v1/institution/departments/',
});

/**
 * Custom department actions
 */
export const departmentActions = {
  /**
   * Assign a Head of Department
   */
  assignHod: async (departmentId: string, userId: string) => {
    return departmentsApiClient.customAction(departmentId, 'assign_hod', { user_id: userId });
  },
  
  /**
   * Add a trainer to the department
   */
  addTrainer: async (departmentId: string, userId: string) => {
    return departmentsApiClient.customAction(departmentId, 'add_trainer', { user_id: userId });
  },
  
  /**
   * Remove a trainer from the department
   */
  removeTrainer: async (departmentId: string, userId: string) => {
    return departmentsApiClient.customAction(departmentId, 'remove_trainer', { user_id: userId });
  },
};
