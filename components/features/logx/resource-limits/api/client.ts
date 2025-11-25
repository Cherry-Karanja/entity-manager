import { createEntityClient } from "@/components/entityManager";
import type { ResourceLimit } from "../../types";

const BASE_URL = "/api/v1/logx/timetabling/resource-limits";

const resourceLimitClient = createEntityClient<ResourceLimit>({
  baseUrl: BASE_URL,
  customActions: {
    /**
     * Check if a limit would be exceeded
     * @param id - The resource limit ID
     * @param additionalUsage - Optional additional usage to check against
     */
    checkLimit: async (id: number | string, additionalUsage?: number) => {
      const response = await fetch(`${BASE_URL}/${id}/check_limit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ additional_usage: additionalUsage }),
      });
      if (!response.ok) {
        throw new Error("Failed to check limit");
      }
      return response.json();
    },
  },
});

export default resourceLimitClient;
