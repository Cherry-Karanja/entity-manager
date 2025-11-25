import { httpClient } from "@/components/connectionManager/http";
import { TimetableConstraint } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/timetable-constraints/";

export const timetableConstraintApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await httpClient.get<{ results: TimetableConstraint[]; count: number }>(
      BASE_PATH,
      params
    );
    return response;
  },

  get: async (id: string | number) => {
    const response = await httpClient.get<TimetableConstraint>(`${BASE_PATH}${id}/`);
    return response;
  },

  create: async (data: Partial<TimetableConstraint>) => {
    const response = await httpClient.post<TimetableConstraint>(BASE_PATH, data);
    return response;
  },

  update: async (id: string | number, data: Partial<TimetableConstraint>) => {
    const response = await httpClient.patch<TimetableConstraint>(`${BASE_PATH}${id}/`, data);
    return response;
  },

  delete: async (id: string | number) => {
    await httpClient.delete(`${BASE_PATH}${id}/`);
  },

  // Custom action: Validate constraint parameters
  validateParameters: async (id: string | number) => {
    const response = await httpClient.post<{
      is_valid: boolean;
      errors: string[];
      warnings: string[];
    }>(`${BASE_PATH}${id}/validate_parameters/`);
    return response;
  },

  // Custom action: Check for constraint violations in a schedule
  checkViolations: async (id: string | number, scheduleId: number) => {
    const response = await httpClient.post<{
      has_violations: boolean;
      violations: Array<{
        schedule_id: number;
        violation_type: string;
        description: string;
        severity: string;
        penalty_score: number;
      }>;
      total_penalty: number;
    }>(`${BASE_PATH}${id}/check_violations/`, { schedule_id: scheduleId });
    return response;
  },
};

export default timetableConstraintApi;
