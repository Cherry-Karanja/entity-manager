/**
 * Resource Limits API Client
 * 
 * API client for Django resource limits endpoint using the HTTP client factory.
 */

import { createHttpClient } from "@/components/entityManager";
import { ResourceLimit } from "../../types";

/**
 * Resource Limits API Client
 * 
 * Example usage:
 * ```typescript
 * // List resource limits with pagination
 * const result = await resourceLimitsApiClient.list({ page: 1, pageSize: 10 });
 * 
 * // Get single resource limit
 * const limit = await resourceLimitsApiClient.get(123);
 * 
 * // Create resource limit
 * const newLimit = await resourceLimitsApiClient.create({ ... });
 * 
 * // Update resource limit
 * const updated = await resourceLimitsApiClient.update(123, { is_active: true });
 * 
 * // Delete resource limit
 * await resourceLimitsApiClient.delete(123);
 * ```
 */
export const resourceLimitsApiClient = createHttpClient<ResourceLimit, {
  check_usage: { current_usage: number; max_limit: number; percentage: number };
}>({
  endpoint: '/api/v1/timetabling/resource-limits/',
});

/**
 * Custom resource limit actions
 */
export const resourceLimitActions = {
  /**
   * Check current usage against limit
   */
  async checkUsage(id: string | number) {
    return resourceLimitsApiClient.customAction(id, 'check_usage');
  },
};

export default resourceLimitsApiClient;
