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
  
  // Add filters
  if (params.filters) {
    params.filters.forEach(filter => {
      const key = filter.field;
      const value = filter.value;
      if (value !== undefined && value !== null) {
        queryParams[key] = value;
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
): ApiClient<T> & { customAction: (id: string | number, action: string, data?: unknown) => Promise<ApiResponse<T>> } {
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
     * // Approve user
     * await client.customAction(userId, 'approve');
     * 
     * // Change role
     * await client.customAction(userId, 'change_role', { role: 'admin' });
     * ```
     */
    async customAction(id: string | number, action: string, data?: unknown): Promise<ApiResponse<T>> {
      try {
        const response = await authApi.post(`${endpoint}${id}/${action}/`, data);
        return handleAxiosResponse<T>(response.data);
      } catch (error) {
        return handleAxiosError(error);
      }
    },
  };
}
