import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { ClassGroupSchedule } from '../../types';

const BASE_PATH = '/api/v1/timetabling/class-group-schedules/';

const base = createHttpClient<ClassGroupSchedule>({ endpoint: BASE_PATH });

export const classGroupScheduleApi = {
  ...base,

  // Custom action: Check for scheduling conflicts
  async checkConflicts(
    timetableId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeScheduleId?: number
  ) {
    const response = await authApi.post(`${BASE_PATH}check_conflicts/`, {
      timetable_id: timetableId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      exclude_schedule_id: excludeScheduleId,
    });
    return response.data;
  },
};

export default classGroupScheduleApi;
