import { createHttpClient } from "@/components/entityManager";
import { TimetableConstraint } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/timetable-constraints/";

export const timetableConstraintApi = createHttpClient<TimetableConstraint>({
  endpoint: BASE_PATH,
});

// Custom actions
export const timetableConstraintActions = {
  // Validate constraint parameters
  validateParameters: async (id: string | number) => {
    return timetableConstraintApi.customAction(id, 'validate_parameters');
  },

  // Check for constraint violations in a schedule
  checkViolations: async (id: string | number, scheduleId: number) => {
    return timetableConstraintApi.customAction(id, 'check_violations', { schedule_id: scheduleId });
  },
};

export default timetableConstraintApi;
