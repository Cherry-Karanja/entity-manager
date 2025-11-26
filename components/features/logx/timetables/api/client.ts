/**
 * Timetable API Client
 * Handles all HTTP operations for timetable management
 */

import { createHttpClient } from "@/components/entityManager";
import { authApi } from '@/components/connectionManager/http/client';
import { Timetable } from '../../types';

const API_BASE = '/api/v1/logx/timetabling';

// Create the base HTTP client for timetables
export const timetablesClient = createHttpClient<Timetable, {
  regenerate_timetable: { message: string; task_id: string; timetable_id: number; status: string };
}>({
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
    try {
      const resp = await timetablesClient.customAction(id, 'regenerate_timetable', options || {});
      return resp.data as { message: string; task_id: string; timetable_id: number; status: string };
    } catch (e) {
      throw new Error('Failed to regenerate timetable');
    }
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
    try {
      const resp = await authApi.get(`${API_BASE}/timetables/${id}/get_statistics/`);
      return resp.data as {
        total_schedules: number;
        total_class_groups: number;
        total_rooms_used: number;
        total_hours: number;
        average_classes_per_group: number;
      };
    } catch (e) {
      throw new Error('Failed to get timetable statistics');
    }
  },
};

export default timetablesClient;
