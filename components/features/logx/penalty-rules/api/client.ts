import { httpClient } from "@/components/connectionManager/http";
import { PenaltyRule } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/penalty-rules/";

export const penaltyRuleApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await httpClient.get<{ results: PenaltyRule[]; count: number }>(
      BASE_PATH,
      params
    );
    return response;
  },

  get: async (id: string | number) => {
    const response = await httpClient.get<PenaltyRule>(`${BASE_PATH}${id}/`);
    return response;
  },

  create: async (data: Partial<PenaltyRule>) => {
    const response = await httpClient.post<PenaltyRule>(BASE_PATH, data);
    return response;
  },

  update: async (id: string | number, data: Partial<PenaltyRule>) => {
    const response = await httpClient.patch<PenaltyRule>(`${BASE_PATH}${id}/`, data);
    return response;
  },

  delete: async (id: string | number) => {
    await httpClient.delete(`${BASE_PATH}${id}/`);
  },

  // Custom action: Calculate penalty for violations
  calculatePenalty: async (
    id: string | number,
    timetableId: number,
    violations: Array<{ type: string; count: number }>
  ) => {
    const response = await httpClient.post<{
      rule_id: number;
      rule_name: string;
      violations_analyzed: number;
      total_penalty: number;
      penalty_breakdown: Array<{
        violation_type: string;
        count: number;
        penalty_per_violation: number;
        subtotal: number;
      }>;
    }>(`${BASE_PATH}${id}/calculate_penalty/`, {
      timetable_id: timetableId,
      violations,
    });
    return response;
  },
};
