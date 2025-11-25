import { createHttpClient } from "@/components/entityManager";
import { ClassGroupSchedule } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/class-group-schedules/";

export const classGroupScheduleApi = createHttpClient<ClassGroupSchedule>({
  endpoint: BASE_PATH,
});

// Custom actions
export const classGroupScheduleActions = {
  // Check for scheduling conflicts
  checkConflicts: async (
    timetableId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeScheduleId?: number
  ) => {
    return classGroupScheduleApi.customAction('', 'check_conflicts', {
      timetable_id: timetableId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      exclude_schedule_id: excludeScheduleId,
    });
  },
};

export default classGroupScheduleApi;
