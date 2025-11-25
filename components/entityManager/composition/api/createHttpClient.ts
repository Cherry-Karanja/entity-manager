/**
 * Create HTTP Client
 * 
 * Factory function to create API clients with automatic authentication.
 * Uses the connectionManager's authApi for all requests.
 */

import { ApiClient, ApiResponse, ListQueryParams } from './types';
import { BaseEntity } from '../../primitives/types';
import { authApi, handleApiError } from '@/components/connectionManager/http/client';
import { AxiosError } from 'axios';

export interface HttpClientConfig {
  /** Base endpoint (e.g., '/api/v1/accounts/users/') */
  endpoint: string;
  
  /** Custom actions endpoints (optional) */
  customActions?: Record<string, string>;
}

/**
 * Build query params object for axios
 */
function buildQueryParams(params?: ListQueryParams): Record<string, unknown> {
  if (!params) return {};
  
  const queryParams: Record<string, unknown> = {};
  
  if (params.page) queryParams.page = params.page;
  if (params.pageSize) queryParams.page_size = params.pageSize;
  if (params.sortField) {
    queryParams.ordering = params.sortDirection === 'desc' ? `-${params.sortField}` : params.sortField;
  }
  if (params.search) queryParams.search = params.search;
  
  // Add filters with Django field lookup syntax
  if (params.filters) {
    params.filters.forEach(filter => {
      const { field, operator, value } = filter;
      if (value !== undefined && value !== null) {
        // Map filter operators to Django field lookups
        let filterKey = field;
        
        switch (operator) {
          case 'equals':
            filterKey = field; // exact match (default)
            break;
          case 'notEquals':
            filterKey = field; // will need to handle this differently
            break;
          case 'contains':
            filterKey = `${field}__icontains`; // case-insensitive contains
            break;
          case 'startsWith':
            filterKey = `${field}__istartswith`; // case-insensitive starts with
            break;
          case 'endsWith':
            filterKey = `${field}__iendswith`; // case-insensitive ends with
            break;
          case 'greaterThan':
            filterKey = `${field}__gt`;
            break;
          case 'greaterThanOrEqual':
            filterKey = `${field}__gte`;
            break;
          case 'lessThan':
            filterKey = `${field}__lt`;
            break;
          case 'lessThanOrEqual':
            filterKey = `${field}__lte`;
            break;
          case 'in':
            filterKey = `${field}__in`;
            break;
          case 'notIn':
            filterKey = field; // will need to handle this differently
            break;
          case 'isNull':
            filterKey = `${field}__isnull`;
            queryParams[filterKey] = true;
            return; // Skip setting value below
          case 'isNotNull':
            filterKey = `${field}__isnull`;
            queryParams[filterKey] = false;
            return; // Skip setting value below
          case 'between':
            // For between, we need two parameters
            if (Array.isArray(value) && value.length === 2) {
              queryParams[`${field}__gte`] = value[0];
              queryParams[`${field}__lte`] = value[1];
            }
            return;
          default:
            filterKey = field; // fallback to exact match
        }
        
        queryParams[filterKey] = value;
      }
    });
  }
  
  // Add any additional params
  Object.keys(params).forEach(key => {
    if (!['page', 'pageSize', 'sortField', 'sortDirection', 'search', 'filters'].includes(key)) {
      const value = params[key];
      if (value !== undefined && value !== null) {
        queryParams[key] = value;
      }
    }
  });
  
  return queryParams;
}

/**
 * Handle axios response and convert to ApiResponse format
 */
function handleAxiosResponse<T>(data: unknown): ApiResponse<T> {
  // Django REST Framework pagination response
  if (data && typeof data === 'object' && 'results' in data) {
    const paginatedData = data as { results: T; count?: number; next?: string; previous?: string };
    return {
      data: paginatedData.results,
      meta: {
        total: paginatedData.count,
        hasMore: !!paginatedData.next,
      },
    };
  }
  
  return {
    data: data as T,
  };
}

/**
 * Handle axios error and convert to ApiResponse format
 */
function handleAxiosError(error: unknown): never {
  if (error instanceof Error) {
    const axiosError = error as AxiosError;
    handleApiError(axiosError);
    throw error;
  }
  throw new Error('An unknown error occurred');
}

/**
 * Create HTTP API Client
 * 
 * Factory function that creates a fully functional API client with authentication.
 * 
 * @example
 * ```typescript
 * const usersApiClient = createHttpClient<User>({
 *   endpoint: '/api/v1/accounts/users/',
 *   customActions: {
 *     approve: 'approve/',
 *     changeRole: 'change_role/',
 *   }
 * });
 * ```
 */
export function createHttpClient<T extends BaseEntity>(
  config: HttpClientConfig
): ApiClient<T> & { customAction: (id: string | number | undefined, action: string, data?: unknown, method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') => Promise<ApiResponse<T>> } {
  const { endpoint } = config;

  return {
    /**
     * List entities with pagination, filtering, and search
     */
    async list(params?: ListQueryParams): Promise<ApiResponse<T[]>> {
      try {
        const queryParams = buildQueryParams(params);
        const response = await authApi.get(endpoint, { params: queryParams });
        return handleAxiosResponse<T[]>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Get single entity by ID
     */
    async get(id: string | number): Promise<ApiResponse<T>> {
      try {
        const response = await authApi.get(`${endpoint}${id}/`);
        return handleAxiosResponse<T>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Create new entity
     */
    async create(data: Partial<T>): Promise<ApiResponse<T>> {
      try {
        const response = await authApi.post(endpoint, data);
        return handleAxiosResponse<T>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Update existing entity
     */
    async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
      try {
        const response = await authApi.patch(`${endpoint}${id}/`, data);
        return handleAxiosResponse<T>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Delete entity
     */
    async delete(id: string | number): Promise<ApiResponse<void>> {
      try {
        await authApi.delete(`${endpoint}${id}/`);
        return { data: undefined as unknown as void };
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Bulk create entities
     */
    async bulkCreate(dataArray: Partial<T>[]): Promise<ApiResponse<T[]>> {
      try {
        const response = await authApi.post(`${endpoint}bulk_create/`, { items: dataArray });
        return handleAxiosResponse<T[]>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Bulk update entities
     */
    async bulkUpdate(updates: Array<{ id: string | number; data: Partial<T> }>): Promise<ApiResponse<T[]>> {
      try {
        const response = await authApi.post(`${endpoint}bulk_update/`, { updates });
        return handleAxiosResponse<T[]>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Bulk delete entities
     */
    async bulkDelete(ids: Array<string | number>): Promise<ApiResponse<void>> {
      try {
        await authApi.post(`${endpoint}bulk_delete/`, { ids });
        return { data: undefined as unknown as void };
      } catch (error) {
        return handleAxiosError(error);
      }
    },

    /**
     * Execute custom action on entity
     * 
     * @example
     * ```typescript
     * // Approve user (POST)
     * await client.customAction(userId, 'approve');
     * 
     * // Change role (POST with data)
     * await client.customAction(userId, 'change_role', { role: 'admin' });
     * 
     * // Get users with role (GET)
     * await client.customAction(roleId, 'users', undefined, 'GET');
     * 
     * // Collection-level action (no id)
     * await client.customAction(undefined, 'expire-all', undefined, 'POST');
     * ```
     */
    async customAction(id: string | number | undefined, action: string, data?: unknown, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'): Promise<ApiResponse<T>> {
      try {
        const url = id !== undefined ? `${endpoint}${id}/${action}/` : `${endpoint}${action}/`;
        let response;
        
        switch (method) {
          case 'GET':
            response = await authApi.get(url, { params: data as Record<string, unknown> });
            break;
          case 'PUT':
            response = await authApi.put(url, data);
            break;
          case 'PATCH':
            response = await authApi.patch(url, data);
            break;
          case 'DELETE':
            response = await authApi.delete(url, { data });
            break;
          case 'POST':
          default:
            response = await authApi.post(url, data);
            break;
        }
        
        return handleAxiosResponse<T>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },
  };
}
