/**
 * Room API Client
 * Handles all HTTP operations for room management
 */

import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { Room } from '../../types';

const API_BASE = '/api/v1/logx/resources/rooms/';

// Create the base HTTP client for rooms
export const roomsClient = createHttpClient<Room>({
  endpoint: API_BASE,
});

// Room-specific actions (if any custom actions exist in views)
// Helper actions that perform room-specific API calls. Not exported to avoid
// name collisions with config-level action definitions.
const roomApiActions = {
  // Check if room is available on a specific date
  checkAvailability: async (id: number, date: string): Promise<{ available: boolean; reason?: string }> => {
    try {
      const resp = await authApi.post(`/api/v1/logx/resources/rooms/${id}/check_availability/`, { date });
      return resp.data as { available: boolean; reason?: string };
    } catch (e) {
      throw new Error('Failed to check room availability');
    }
  },
};

export default roomsClient;
