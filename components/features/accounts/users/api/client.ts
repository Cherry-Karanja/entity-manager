/**
 * Users API Client
 * 
 * API client for Django users endpoint using the HTTP client factory.
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
import { User } from '../../types';

/**
 * Users API Client
 * 
 * Example usage:
 * ```typescript
 * // List users with pagination
 * const result = await usersApiClient.list({ page: 1, pageSize: 10 });
 * 
 * // Get single user
 * const user = await usersApiClient.get(123);
 * 
 * // Create user
 * const newUser = await usersApiClient.create({ email: 'test@example.com', ... });
 * 
 * // Update user
 * const updated = await usersApiClient.update(123, { first_name: 'John' });
 * 
 * // Delete user
 * await usersApiClient.delete(123);
 * 
 * // Bulk operations
 * await usersApiClient.bulkDelete([1, 2, 3]);
 * ```
 */
export const usersApiClient = createHttpClient<User>({
  endpoint: '/api/v1/accounts/users/',
});

/**
 * Custom user actions
 * 
 * These use the customAction method which makes POST requests to:
 * /api/v1/accounts/users/{id}/{action}/
 * 
 * Example usage:
 * ```typescript
 * // Approve user
 * await userActions.approve(123);
 * 
 * // Change role
 * await userActions.changeRole(123, 'admin');
 * 
 * // Unlock account
 * await userActions.unlockAccount(123);
 * 
 * // Send password reset email
 * await userActions.resetPassword(123);
 * ```
 */
export const userActions = {
  /**
   * Approve user
   */
  async approve(id: string | number) {
    return usersApiClient.customAction(id, 'approve');
  },

  /**
   * Change user role
   */
  async changeRole(id: string | number, role: string) {
    return usersApiClient.customAction(id, 'change_role', { role });
  },

  /**
   * Unlock account
   */
  async unlockAccount(id: string | number) {
    return usersApiClient.customAction(id, 'unlock');
  },

  /**
   * Reset password (send email)
   */
  async resetPassword(id: string | number) {
    return usersApiClient.customAction(id, 'reset_password');
  },
};
