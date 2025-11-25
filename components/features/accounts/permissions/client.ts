/**
 * Permission API Client
 * 
 * API client for Django permissions endpoint using the HTTP client factory.
 */

import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { Permission } from '../types';

/**
 * Permission API Client
 */
export const permissionsApiClient = createHttpClient<Permission>({
  endpoint: '/api/v1/accounts/permissions/',
});

/**
 * Custom permission actions
 */
export const permissionActions = {
  /**
   * Get permissions grouped by app
   */
  async getByApp() {
    const response = await authApi.get('/api/v1/accounts/permissions/by_app/');
    return response.data;
  },

  /**
   * Get permissions for a specific model
   */
  async getByModel(appLabel: string, model: string) {
    const response = await authApi.get('/api/v1/accounts/permissions/by_model/', {
      params: { app_label: appLabel, model },
    });
    return response.data;
  },
};
