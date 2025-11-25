/**
 * UserRole API Client
 * 
 * API client for Django user-roles endpoint using the HTTP client factory.
 * 
 * The HTTP client factory handles all CRUD operations automatically:
 * - Authentication via authApi from connectionManager
 * - CSRF token handling
 * - 401 token refresh
 * - DRF pagination format (results, count, next, previous)
 * - Error handling with toast notifications
 * - Bulk operations
 * - Custom actions
 */

import { createHttpClient } from '@/components/entityManager';
import { UserRole } from '../types';

/**
 * UserRole API Client
 * 
 * Example usage:
 * ```typescript
 * // List roles with pagination
 * const result = await userRolesApiClient.list({ page: 1, pageSize: 10 });
 * 
 * // Get single role
 * const role = await userRolesApiClient.get('uuid-here');
 * 
 * // Create role
 * const newRole = await userRolesApiClient.create({ name: 'manager', display_name: 'Manager', ... });
 * 
 * // Update role
 * const updated = await userRolesApiClient.update('uuid', { display_name: 'Updated Name' });
 * 
 * // Delete role
 * await userRolesApiClient.delete('uuid');
 * 
 * // Bulk operations
 * await userRolesApiClient.bulkDelete(['uuid1', 'uuid2', 'uuid3']);
 * ```
 */
export const userRolesApiClient = createHttpClient<UserRole>({
  endpoint: '/api/v1/accounts/user-roles/',
});

/**
 * Custom user role actions
 * 
 * These use the customAction method which makes POST requests to:
 * /api/v1/accounts/user-roles/{id}/{action}/
 * 
 * Example usage:
 * ```typescript
 * // Get users with this role
 * await userRoleActions.getUsers('uuid');
 * ```
 */
export const userRoleActions = {
  /**
   * Get users with this role
   */
  async getUsers(id: string | number) {
    return userRolesApiClient.customAction(id, 'users');
  },
};

