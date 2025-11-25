import { createHttpClient } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/resource-limits/";

export const resourceLimitApi = createHttpClient<ResourceLimit>({
  endpoint: BASE_PATH,
});

// Custom action: Check if a limit would be exceeded
export const resourceLimitActions = {
  checkLimit: async (id: number | string, additionalUsage?: number) => {
    return resourceLimitApi.customAction(id, 'check_limit', { additional_usage: additionalUsage });
  },
};

export default resourceLimitApi;
