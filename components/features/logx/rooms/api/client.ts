/**
 * Rooms API Client
 * 
 * API client for Django rooms endpoint using the HTTP client factory.
 */

import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { Room } from '../../types';

/**
 * Rooms API Client
 * 
 * Example usage:
 * ```typescript
 * // List rooms with pagination
 * const result = await roomsApiClient.list({ page: 1, pageSize: 10 });
 * 
 * // Get single room
 * const room = await roomsApiClient.get(123);
 * 
 * // Create room
 * const newRoom = await roomsApiClient.create({ name: 'Room 101', ... });
 * 
 * // Update room
 * const updated = await roomsApiClient.update(123, { is_active: true });
 * 
 * // Delete room
 * await roomsApiClient.delete(123);
 * ```
 */
export const roomsApiClient = createHttpClient<Room, {
  check_availability: { available: boolean; reason?: string };
}>({
  endpoint: '/api/v1/resources/rooms/',
});

/**
 * Custom room actions
 */
export const roomActions = {
  /**
   * Check if room is available on a specific date
   */
  async checkAvailability(id: number, date: string) {
    try {
      const resp = await authApi.post(`/api/v1/resources/rooms/${id}/check_availability/`, { date });
      return resp.data as { available: boolean; reason?: string };
    } catch (e) {
      throw new Error('Failed to check room availability');
    }
  },
};

// Legacy exports for backward compatibility
export const roomsClient = roomsApiClient;
export default roomsApiClient;
