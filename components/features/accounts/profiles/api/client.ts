/**
 * UserProfile API Client
 * 
 * API client for profile management operations.
 */

import { apiClient } from '@/lib/api-client';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest, UserProfileListResponse } from '../types';

const BASE_URL = '/api/accounts/profiles';

export const userProfileApi = {
  /**
   * Get all profiles
   */
  list: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
    status?: string;
  }): Promise<UserProfileListResponse> => {
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get a single profile
   */
  get: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.get(`${BASE_URL}/${id}/`);
    return response.data;
  },

  /**
   * Create a new profile
   */
  create: async (data: CreateUserProfileRequest): Promise<UserProfile> => {
    const formData = new FormData();
    
    // Add avatar file if present
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    // Add other fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'avatar' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await apiClient.post(`${BASE_URL}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update an existing profile
   */
  update: async (id: string, data: UpdateUserProfileRequest): Promise<UserProfile> => {
    const formData = new FormData();
    
    // Add avatar file if present
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    // Add other fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'avatar' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await apiClient.patch(`${BASE_URL}/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete a profile
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}/`);
  },

  /**
   * Approve a profile
   */
  approve: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/approve/`);
    return response.data;
  },

  /**
   * Reject a profile
   */
  reject: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/reject/`);
    return response.data;
  },

  /**
   * Suspend a profile
   */
  suspend: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/suspend/`);
    return response.data;
  },

  /**
   * Bulk approve profiles
   */
  bulkApprove: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk_approve/`, { ids });
  },

  /**
   * Bulk reject profiles
   */
  bulkReject: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk_reject/`, { ids });
  },

  /**
   * Bulk delete profiles
   */
  bulkDelete: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk_delete/`, { ids });
  },
};
