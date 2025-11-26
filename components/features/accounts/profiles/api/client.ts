/**
 * UserProfile API Client
 * 
 * API client for Django user-profiles endpoint using the HTTP client factory.
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
import { UserProfile } from '../types';

/**
 * UserProfile API Client
 * 
 * Example usage:
 * ```typescript
 * // List profiles with pagination
 * const result = await userProfilesApiClient.list({ page: 1, pageSize: 10 });
 * 
 * // Get single profile
 * const profile = await userProfilesApiClient.get('uuid-here');
 * 
 * // Create profile
 * const newProfile = await userProfilesApiClient.create({ user_id: '123', ... });
 * 
 * // Update profile
 * const updated = await userProfilesApiClient.update('uuid', { bio: 'New bio' });
 * 
 * // Delete profile
 * await userProfilesApiClient.delete('uuid');
 * 
 * // Bulk operations
 * await userProfilesApiClient.bulkDelete(['uuid1', 'uuid2', 'uuid3']);
 * ```
 */
export const userProfilesApiClient = createHttpClient<UserProfile, {
  approve: UserProfile;
  reject: UserProfile;
  suspend: UserProfile;
}>({
  endpoint: '/api/v1/accounts/user-profiles/',
});

/**
 * Custom user profile actions
 * 
 * These use the customAction method which makes POST requests to:
 * /api/v1/accounts/user-profiles/{id}/{action}/
 * 
 * Example usage:
 * ```typescript
 * // Approve profile
 * await userProfileActions.approve('uuid');
 * 
 * // Reject profile
 * await userProfileActions.reject('uuid');
 * 
 * // Suspend profile
 * await userProfileActions.suspend('uuid');
 * ```
 */
export const userProfileActions = {
  /**
   * Approve user profile
   */
  async approve(id: string | number) {
    return userProfilesApiClient.customAction(id, 'approve');
  },

  /**
   * Reject user profile
   */
  async reject(id: string | number) {
    return userProfilesApiClient.customAction(id, 'reject');
  },

  /**
   * Suspend user profile
   */
  async suspend(id: string | number) {
    return userProfilesApiClient.customAction(id, 'suspend');
  },
};
