"use strict";
/**
 * Response normalization helpers
 *
 * Provide small helpers to adapt legacy DRF-style responses ({ results, count })
 * and current canonical ApiResponse<T[]> shapes to a predictable array result
 * during the migration.
 */
exports.__esModule = true;
exports.getEntityData = exports.getListData = void 0;
function getListData(response) {
    if (!response)
        return [];
    if (typeof response === 'object') {
        if ('data' in response) {
            var d = response.data;
            return Array.isArray(d) ? d : (d ? [d] : []);
        }
        if ('results' in response) {
            return Array.isArray(response.results) ? response.results : [];
        }
    }
    if (Array.isArray(response))
        return response;
    return [];
}
exports.getListData = getListData;
function getEntityData(response) {
    if (!response)
        return undefined;
    if (typeof response === 'object') {
        if ('data' in response)
            return response.data;
        if ('results' in response) {
            // If a paginated response was passed accidentally for a single entity,
            // return the first result if present.
            return Array.isArray(response.results) && response.results.length > 0
                ? response.results[0]
                : undefined;
        }
    }
    return response;
}
exports.getEntityData = getEntityData;
