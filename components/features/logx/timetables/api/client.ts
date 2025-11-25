/**
 * Timetable API Client
 * Handles all HTTP operations for timetable management
 */

import { createHttpClient } from "@/components/entityManager";
import { Timetable } from '../../types';

const API_BASE = '/api/v1/logx/timetabling/timetables/';

// Create the base HTTP client for timetables
export const timetablesClient = createHttpClient<Timetable>({
  endpoint: API_BASE,
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
  ) => {
    return timetablesClient.customAction(id, 'regenerate_timetable', options || {});
  },

  /**
   * Get timetable statistics
   */
  getStatistics: async (id: number) => {
    return timetablesClient.customAction(id, 'get_statistics', {}, 'GET');
  },
};

export default timetablesClient;
