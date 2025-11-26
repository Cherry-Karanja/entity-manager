/**
 * Response normalization helpers
 *
 * Provide small helpers to adapt legacy DRF-style responses ({ results, count })
 * and current canonical ApiResponse<T[]> shapes to a predictable array result
 * during the migration.
 */

export function getListData<T>(response: any): T[] {
  if (!response) return [] as T[];
  if (typeof response === 'object') {
    if ('data' in response) {
      const d = response.data;
      return Array.isArray(d) ? d : (d ? [d] : []);
    }
    if ('results' in response) {
      return Array.isArray(response.results) ? response.results : [];
    }
  }

  if (Array.isArray(response)) return response as T[];
  return [] as T[];
}

export function getEntityData<T>(response: any): T | undefined {
  if (!response) return undefined;
  if (typeof response === 'object') {
    if ('data' in response) return response.data as T;
    if ('results' in response) {
      // If a paginated response was passed accidentally for a single entity,
      // return the first result if present.
      return Array.isArray(response.results) && response.results.length > 0
        ? response.results[0] as T
        : undefined;
    }
  }
  return response as T;
}
