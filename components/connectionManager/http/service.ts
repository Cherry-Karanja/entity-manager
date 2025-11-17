"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from './hooks';
import { httpClient } from './client';
import { EntityConfig } from "@/components/entityManager/primitives";
import { handleApiError } from "./client";
import { AxiosError } from "axios";

/**
 * Get endpoint URL for an entity operation
 */
function getEndpointUrl(
  config: EntityConfig,
  operation: 'list' | 'create' | 'update' | 'delete'
): string {
  // Use top-level endpoints (simplified for v2)
  return config.endpoints[operation] || '/';
}

/**
 * Create an API service for CRUD operations
 */
export function createApiService<T, U = T>(
  urlOrConfig: string | EntityConfig
) {
  // Determine the base URL
  const getBaseUrl = (operation: 'list' | 'create' | 'update' | 'delete'): string => {
    if (typeof urlOrConfig === 'string') {
      return urlOrConfig;
    }

    // Use nested resource utilities if config and context are provided
    return getEndpointUrl(urlOrConfig, operation);
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
      const rest = { ...formattedParams };
      delete rest.page;
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
          } catch (error) {
            throw error;
          }
        },
        onSuccess: () => {
          // Invalidate queries for this entity
          const invalidateUrl = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.endpoints.list;
          queryClient.invalidateQueries({ queryKey: [invalidateUrl] });
        },
        onError: (error:AxiosError) => {
          handleApiError(error);
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
            : getBaseUrl('update');
          try {
            const response = await httpClient.instance.put(updateUrl, data);
            return response.data;
          } catch (error) {
            throw error;
          }
        },
        onSuccess: () => {
          // Invalidate queries for this entity
          const invalidateUrl = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.endpoints.list;
          queryClient.invalidateQueries({ queryKey: [invalidateUrl] });
        },
        onError: (error:AxiosError) => {
          handleApiError(error);
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
            : getBaseUrl('delete');
          try {
            const response = await httpClient.instance.delete(deleteUrl);
            return response.data;
          } catch (error) {
            throw error;
          }
        },
        onSuccess: () => {
          // Invalidate queries for this entity
          const invalidateUrl = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.endpoints.list;
          queryClient.invalidateQueries({ queryKey: [invalidateUrl] });
        },
        onError: (error:AxiosError) => {
          handleApiError(error);
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