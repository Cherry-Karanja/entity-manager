import { httpClient } from "@/components/connectionManager/http";
import { ClassGroupSchedule } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/class-group-schedules/";

export const classGroupScheduleApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await httpClient.get<{ results: ClassGroupSchedule[]; count: number }>(
      BASE_PATH,
      params
    );
    return response;
  },

  get: async (id: string | number) => {
    const response = await httpClient.get<ClassGroupSchedule>(`${BASE_PATH}${id}/`);
    return response;
  },

  create: async (data: Partial<ClassGroupSchedule>) => {
    const response = await httpClient.post<ClassGroupSchedule>(BASE_PATH, data);
    return response;
  },

  update: async (id: string | number, data: Partial<ClassGroupSchedule>) => {
    const response = await httpClient.patch<ClassGroupSchedule>(`${BASE_PATH}${id}/`, data);
    return response;
  },

  delete: async (id: string | number) => {
    await httpClient.delete(`${BASE_PATH}${id}/`);
  },

  // Custom action: Check for scheduling conflicts
  checkConflicts: async (
    timetableId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeScheduleId?: number
  ) => {
    const response = await httpClient.post<{
      has_conflicts: boolean;
      conflicts: Array<{
        schedule_id: number;
        class_group_name: string;
        unit_name: string;
        room_name: string;
        start_time: string;
        end_time: string;
        conflict_type: string;
      }>;
    }>(`${BASE_PATH}check_conflicts/`, {
      timetable_id: timetableId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      exclude_schedule_id: excludeScheduleId,
    });
    return response;
  },
};

export default classGroupScheduleApi;
