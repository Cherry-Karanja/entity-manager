/**
 * Room API Client
 * Handles all HTTP operations for room management
 */

import { createHttpClient } from '@/components/entityManager';
import { Room } from '../../types';

const API_BASE = '/api/v1/logx/resources/rooms/';

// Create the base HTTP client for rooms
export const roomsClient = createHttpClient<Room>({
  endpoint: API_BASE,
});

// Room-specific actions (if any custom actions exist in views)
export const roomActions = {
  // Check if room is available on a specific date
  checkAvailability: async (id: number | string, date: string) => {
    return roomsClient.customAction(id, 'check_availability', { date });
  },
};

export default roomsClient;
