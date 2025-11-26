import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { TimetableConstraint } from '../../types';

const BASE_PATH = '/api/v1/logx/timetabling/timetable-constraints/';

const base = createHttpClient<TimetableConstraint>({ endpoint: BASE_PATH });

export const timetableConstraintApi = {
  ...base,

  // Custom action: Validate constraint parameters
  async validateParameters(id: string | number) {
    const response = await authApi.post(`${BASE_PATH}${id}/validate_parameters/`);
      return response.data;
  },

  // Custom action: Check for constraint violations in a schedule
  async checkViolations(id: string | number, scheduleId: number) {
    const response = await authApi.post(`${BASE_PATH}${id}/check_violations/`, { schedule_id: scheduleId });
    return response.data;
  },
};

export default timetableConstraintApi;
