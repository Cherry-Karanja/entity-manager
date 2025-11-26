/**
 * Timetables API Client
 * 
 * API client for Django timetables endpoint using the HTTP client factory.
 */

import { createHttpClient } from "@/components/entityManager";
import { authApi } from '@/components/connectionManager/http/client';
import { Timetable } from '../../types';

/**
 * Timetables API Client
 * 
 * Example usage:
 * ```typescript
 * // List timetables with pagination
 * const result = await timetablesApiClient.list({ page: 1, pageSize: 10 });
 * 
 * // Get single timetable
 * const timetable = await timetablesApiClient.get(123);
 * 
 * // Create timetable
 * const newTimetable = await timetablesApiClient.create({ name: 'Fall 2024', ... });
 * 
 * // Update timetable
 * const updated = await timetablesApiClient.update(123, { is_active: true });
 * 
 * // Delete timetable
 * await timetablesApiClient.delete(123);
 * ```
 */
export const timetablesApiClient = createHttpClient<Timetable, {
  regenerate_timetable: { message: string; task_id: string; timetable_id: number; status: string };
  get_statistics: { total_schedules: number; total_class_groups: number; total_rooms_used: number; total_hours: number; average_classes_per_group: number };
}>({
  endpoint: '/api/v1/timetabling/timetables/',
});

/**
 * Custom timetable actions
 */
export const timetableActions = {
  /**
   * Regenerate timetable in the background
   */
  async regenerateTimetable(
    id: number,
    options?: {
      department_ids?: number[];
      class_group_ids?: number[];
      use_optimization?: boolean;
    }
  ) {
    try {
      const resp = await timetablesApiClient.customAction(id, 'regenerate_timetable', options || {});
      return resp.data as { message: string; task_id: string; timetable_id: number; status: string };
    } catch (e) {
      throw new Error('Failed to regenerate timetable');
    }
  },

  /**
   * Get timetable statistics
   */
  async getStatistics(id: number) {
    try {
      const resp = await authApi.get(`/api/v1/timetabling/timetables/${id}/get_statistics/`);
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

// Legacy exports for backward compatibility
export const timetablesClient = timetablesApiClient;
export default timetablesApiClient;
