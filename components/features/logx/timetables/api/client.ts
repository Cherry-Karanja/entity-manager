/**
 * Timetable API Client
 * Handles all HTTP operations for timetable management
 */

import { createHttpClient } from "@/components/entityManager";
import { Timetable } from '../../types';

const API_BASE = '/api/v1/logx/timetabling';

// Create the base HTTP client for timetables
export const timetablesClient = createHttpClient<Timetable>({
  endpoint: `${API_BASE}/timetables/`,
});

// Timetable-specific actions from the ViewSet
export const timetableActions = {
  /**
   * Regenerate timetable in the background
   */
  regenerateTimetable: async (
    id: number, 
    options?: {
      department_ids?: number[];
      class_group_ids?: number[];
      use_optimization?: boolean;
    }
  ): Promise<{ message: string; task_id: string; timetable_id: number; status: string }> => {
    const response = await fetch(`${API_BASE}/timetables/${id}/regenerate_timetable/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(options || {}),
    });
    if (!response.ok) {
      throw new Error('Failed to regenerate timetable');
    }
    return response.json();
  },

  /**
   * Get timetable statistics
   */
  getStatistics: async (id: number): Promise<{
    total_schedules: number;
    total_class_groups: number;
    total_rooms_used: number;
    total_hours: number;
    average_classes_per_group: number;
  }> => {
    const response = await fetch(`${API_BASE}/timetables/${id}/get_statistics/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to get timetable statistics');
    }
    return response.json();
  },
};

export default timetablesClient;
