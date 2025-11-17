/**
 * Users API Client
 * 
 * API client for Django users endpoint.
 */

import { ApiClient, ApiResponse, ListQueryParams } from '@/components/entityManager/composition/api/types';
import { User } from '../../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USERS_ENDPOINT = '/api/v1/accounts/users/';

/**
 * Build query string from params
 */
function buildQueryString(params?: ListQueryParams): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.pageSize) searchParams.append('page_size', params.pageSize.toString());
  if (params.sortField) searchParams.append('ordering', 
    params.sortDirection === 'desc' ? `-${params.sortField}` : params.sortField);
  if (params.search) searchParams.append('search', params.search);
  
  // Add filters
  if (params.filters) {
    params.filters.forEach(filter => {
      const key = filter.field;
      const value = filter.value;
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  // Add any additional params
  Object.keys(params).forEach(key => {
    if (!['page', 'pageSize', 'sortField', 'sortDirection', 'search', 'filters'].includes(key)) {
      const value = params[key];
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Get auth headers
 */
function getAuthHeaders(): Record<string, string> {
  // TODO: Implement actual authentication
  // This should get the token from your auth provider
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') 
    : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    return {
      data: null as unknown as T,
      error: {
        message: errorData.detail || errorData.message || 'An error occurred',
        code: response.status.toString(),
        details: errorData,
      },
    };
  }
  
  const data = await response.json();
  
  // Django REST Framework pagination response
  if (data.results) {
    return {
      data: data.results as T,
      meta: {
        total: data.count,
        page: data.page || 1,
        pageSize: data.results.length,
        hasMore: !!data.next,
      },
    };
  }
  
  return {
    data: data as T,
  };
}

/**
 * Users API Client
 */
export const usersApiClient: ApiClient<User> = {
  /**
   * List users with pagination, filtering, and search
   */
  async list(params?: ListQueryParams): Promise<ApiResponse<User[]>> {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  /**
   * Get single user by ID
   */
  async get(id: string | number): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<User>(response);
  },

  /**
   * Create new user
   */
  async create(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },

  /**
   * Update existing user
   */
  async update(id: string | number, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },

  /**
   * Delete user
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  /**
   * Bulk delete users
   */
  async bulkDelete(ids: Array<string | number>): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}bulk_delete/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    return handleResponse<void>(response);
  },
};

/**
 * Custom user actions
 */
export const userActions = {
  /**
   * Approve user
   */
  async approve(id: string | number): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/approve/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<User>(response);
  },

  /**
   * Change user role
   */
  async changeRole(id: string | number, role: string): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/change_role/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse<User>(response);
  },

  /**
   * Unlock account
   */
  async unlockAccount(id: string | number): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/unlock/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<User>(response);
  },

  /**
   * Reset password (send email)
   */
  async resetPassword(id: string | number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}${USERS_ENDPOINT}${id}/reset_password/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};
