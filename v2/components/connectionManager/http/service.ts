"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from './hooks';
import { DjangoPaginatedResponse } from './types';
import { AxiosError } from "axios";
import { httpClient } from './client';
import { ApiServiceOptions, EntityConfig, NestedResourceContext } from './types';

/**
 * Utility function to build nested resource URLs
 */
function buildNestedUrl(
  pattern: string,
  context: NestedResourceContext,
  entityId?: string | number
): string {
  let url = pattern;

  // Replace parent entity placeholder
  url = url.replace('{parentEntity}', context.parentEntity);

  // Replace parent ID placeholder
  url = url.replace('{parentId}', String(context.parentId));

  // Replace entity ID placeholder if provided
  if (entityId !== undefined) {
    url = url.replace('{id}', String(entityId));
  }

  // Add nested path segments if provided
  if (context.nestedPath && context.nestedPath.length > 0) {
    const nestedPathStr = context.nestedPath.join('/');
    url = url.replace(/\/$/, '') + '/' + nestedPathStr + '/';
  }

  return url;
}

/**
 * Get endpoint URL for an entity operation
 */
function getEndpointUrl(
  config: EntityConfig,
  operation: 'list' | 'create' | 'update' | 'delete',
  context?: NestedResourceContext,
  entityId?: string | number
): string {
  // Use top-level endpoints (simplified for v2)
  return config.endpoints[operation];
}

/**
 * Create an API service for CRUD operations
 */
export function createApiService<T, U = T>(
  urlOrConfig: string | EntityConfig,
  options: ApiServiceOptions = {}
) {
  const {
    requiredPermission,
    checkPermissions = true,
    nestedContext,
    entityConfig
  } = options;

  // Determine the base URL
  const getBaseUrl = (operation: 'list' | 'create' | 'update' | 'delete', entityId?: string | number): string => {
    if (typeof urlOrConfig === 'string') {
      return urlOrConfig;
    }

    // Use nested resource utilities if config and context are provided
    return getEndpointUrl(urlOrConfig, operation, nestedContext, entityId);
  };

  // Return a hook that can be used in components
  return function useEntityApi(pageSize: number = 10) {
    const queryClient = useQueryClient();
    const baseUrl = typeof urlOrConfig === 'string' ? urlOrConfig : getBaseUrl('list');
    const apiHook = useApi<T, U>(baseUrl, pageSize);

    const useFetchData = (params?: {
      page?: number;
      page_size?: number;
      search?: string;
      sort_by?: string;
      [key: string]: unknown;
    }, enabled: boolean = true) => {
      // Format params for the API
      const formattedParams = {
        page_size: params?.page_size || pageSize,
        search: params?.search,
        ordering: params?.sort_by,
        ...params // Include unknown additional filter parameters
      };

      // useApi.useFetchData signature is (page, params?, enabled?)
      const pageParam = formattedParams.page || 1;
      // pass remaining params (without page) to the underlying hook
      const { page, ...rest } = formattedParams;
      const query = apiHook.useFetchData(pageParam, rest, enabled);

      return {
        ...query,
        data: query.data ? {
          ...query.data,
          results: query.data.results || []
        } : undefined
      };
    };

    const useFetchById = (id: string | number) => {
      return apiHook.useFetchById(id);
    };

    const useAddItem = () => {
      const addItemMutation = useMutation({
        mutationFn: async (data: U) => {
          const createUrl = typeof urlOrConfig === 'string' ? urlOrConfig : getBaseUrl('create');
          try {
            const response = await httpClient.instance.post(createUrl, data);
            return response.data;
          } catch (error: any) {
            throw error;
          }
        },
        onSuccess: () => {
          // Invalidate queries for this entity
          const invalidateUrl = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.endpoints.list;
          queryClient.invalidateQueries({ queryKey: [invalidateUrl] });
        },
        onError: (error) => {
          console.error('Add item error:', error);
        }
      });

      return addItemMutation;
    };

    const useUpdateItem = () => {
      const updateItemMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string | number; data: U }) => {
          const updateUrl = typeof urlOrConfig === 'string'
            ? `${urlOrConfig}${id}/`
            : getBaseUrl('update', id);
          try {
            const response = await httpClient.instance.put(updateUrl, data);
            return response.data;
          } catch (error: any) {
            throw error;
          }
        },
        onSuccess: () => {
          // Invalidate queries for this entity
          const invalidateUrl = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.endpoints.list;
          queryClient.invalidateQueries({ queryKey: [invalidateUrl] });
        },
        onError: (error) => {
          console.error('Update item error:', error);
        }
      });

      return updateItemMutation;
    };

    const useDeleteItem = () => {
      const deleteItemMutation = useMutation({
        mutationFn: async (id: string | number) => {
          const deleteUrl = typeof urlOrConfig === 'string'
            ? `${urlOrConfig}${id}/`
            : getBaseUrl('delete', id);
          try {
            const response = await httpClient.instance.delete(deleteUrl);
            return response.data;
          } catch (error: any) {
            throw error;
          }
        },
        onSuccess: () => {
          // Invalidate queries for this entity
          const invalidateUrl = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.endpoints.list;
          queryClient.invalidateQueries({ queryKey: [invalidateUrl] });
        },
        onError: (error) => {
          console.error('Delete item error:', error);
        }
      });

      return deleteItemMutation;
    };

    return {
      useFetchData,
      useFetchById,
      useAddItem,
      useUpdateItem,
      useDeleteItem,
    };
  };
}