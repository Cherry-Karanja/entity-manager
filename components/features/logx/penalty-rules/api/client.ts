import { createHttpClient } from "@/components/entityManager";
import { PenaltyRule } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/penalty-rules/";

export const penaltyRuleApi = createHttpClient<PenaltyRule>({
  endpoint: BASE_PATH,
});

// Custom actions
export const penaltyRuleActions = {
  // Calculate penalty for violations
  calculatePenalty: async (
    id: string | number,
    timetableId: number,
    violations: Array<{ type: string; count: number }>
  ) => {
    return penaltyRuleApi.customAction(id, 'calculate_penalty', {
      timetable_id: timetableId,
      violations,
    });
  },
};

export default penaltyRuleApi;
