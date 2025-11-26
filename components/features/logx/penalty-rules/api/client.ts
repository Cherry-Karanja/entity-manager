import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { PenaltyRule } from '../../types';

const BASE_PATH = '/api/v1/timetabling/penalty-rules/';

const base = createHttpClient<PenaltyRule>({ endpoint: BASE_PATH });

export const penaltyRuleApi = {
  ...base,

  // Custom action: Calculate penalty for violations
  async calculatePenalty(
    id: string | number,
    timetableId: number,
    violations: Array<{ type: string; count: number }>
  ) {
    const response = await authApi.post(`${BASE_PATH}${id}/calculate_penalty/`, {
      timetable_id: timetableId,
      violations,
    });

    // Return normalized ApiResponse-like shape for consistency
    return response.data;
  },
};

export default penaltyRuleApi;
