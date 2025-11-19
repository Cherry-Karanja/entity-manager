/**
 * UserRole API Client
 * 
 * API client for role management operations.
 */

import { apiClient } from '@/lib/api-client';
import { UserRole, CreateUserRoleRequest, UpdateUserRoleRequest, UserRoleListResponse } from '../types';

const BASE_URL = '/api/accounts/roles';

export const userRoleApi = {
  /**
   * Get all roles
   */
  list: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
    is_active?: boolean;
  }): Promise<UserRoleListResponse> => {
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get a single role
   */
  get: async (id: string): Promise<UserRole> => {
    const response = await apiClient.get(`${BASE_URL}/${id}/`);
    return response.data;
  },

  /**
   * Create a new role
   */
  create: async (data: CreateUserRoleRequest): Promise<UserRole> => {
    const response = await apiClient.post(`${BASE_URL}/`, data);
    return response.data;
  },

  /**
   * Update an existing role
   */
  update: async (id: string, data: UpdateUserRoleRequest): Promise<UserRole> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a role
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}/`);
  },

  /**
   * Activate a role
   */
  activate: async (id: string): Promise<UserRole> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/activate/`);
    return response.data;
  },

  /**
   * Deactivate a role
   */
  deactivate: async (id: string): Promise<UserRole> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/deactivate/`);
    return response.data;
  },

  /**
   * Bulk activate roles
   */
  bulkActivate: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk_activate/`, { ids });
  },

  /**
   * Bulk deactivate roles
   */
  bulkDeactivate: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk_deactivate/`, { ids });
  },

  /**
   * Bulk delete roles
   */
  bulkDelete: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk_delete/`, { ids });
  },
};

