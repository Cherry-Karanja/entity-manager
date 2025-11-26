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
 * Supports CRUD, bulk operations and custom actions. Custom actions can now be
 * typed per-action using a mapping generic which makes `client.customAction(...)`
 * return a correctly typed `ApiResponse` for each action key.
 * 
 * Examples
 * ```typescript
 * // Basic (no special action types - actions default to returning the entity type)
 * const usersApiClient = createHttpClient<User>({
 *   endpoint: '/api/v1/accounts/users/',
 * });
 *
 * // With action-specific typing: map action keys to result types
 * const rolesClient = createHttpClient<UserRole, {
 *   users: User[];            // users action returns an array of User
 *   approve: User;            // approve returns the updated User
 * }>(
 *   {
 *     endpoint: '/api/v1/accounts/user-roles/',
 *     customActions: {
 *       users: 'users/',
 *       approve: 'approve/',
 *     }
 *   }
 * );
 *
 * // Calling a typed action
 * const usersRes = await rolesClient.customAction('role-id', 'users');
 * // usersRes.data is typed as User[]
 *
 * const approveRes = await rolesClient.customAction('user-id', 'approve');
 * // approveRes.data is typed as User
 * ```
 *
 * Notes:
 * - The `Actions` generic is a mapping from action key (string literal) to the
 *   expected response type. It improves compile-time safety but cannot
 *   validate runtime responses — the axios response is cast to the declared
 *   type.
 * - The optional `config.customActions` lets you provide the endpoint suffix
 *   used for each action (e.g. 'approve/'). Keys in `customActions` should
 *   match the keys declared in the `Actions` mapping.
 */
export function createHttpClient<
  T extends BaseEntity,
  Actions extends Record<string, unknown> = Record<string, T>
>(
  config: HttpClientConfig & { customActions?: Record<Extract<keyof Actions, string>, string> }
):
  ApiClient<T> & {
    customAction: <K extends Extract<keyof Actions, string>>(id: string | number, action: K, data?: unknown) => Promise<ApiResponse<Actions[K]>>;
  } {
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
    async customAction<K extends Extract<keyof Actions, string>>(id: string | number, action: K, data?: unknown): Promise<ApiResponse<Actions[K]>> {
      try {
        const response = await authApi.post(`${endpoint}${id}/${String(action)}/`, data);
        // We cannot know the runtime type; cast to the expected action result type
        return handleAxiosResponse<any>(response.data) as ApiResponse<Actions[K]>;
      } catch (error) {
        return handleAxiosError(error);
      }
    },
  };
}
