/**
 * Room API Client
 * Handles all HTTP operations for room management
 */

import { createHttpClient } from '@/components/connectionManager/http';
import { Room } from '../../types';

const API_BASE = '/api/v1/logx/resources';

// Create the base HTTP client for rooms
export const roomsClient = createHttpClient<Room>(`${API_BASE}/rooms/`);

// Room-specific actions (if any custom actions exist in views)
export const roomActions = {
  // Check if room is available on a specific date
  checkAvailability: async (id: number, date: string): Promise<{ available: boolean; reason?: string }> => {
    const response = await fetch(`${API_BASE}/rooms/${id}/check_availability/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ date }),
    });
    if (!response.ok) {
      throw new Error('Failed to check room availability');
    }
    return response.json();
  },
};
