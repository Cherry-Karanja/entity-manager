"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { DjangoPaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import * as ApiService from './apiConfig'
import { api } from "@/utils/api";
import { getEndpointUrl, NestedResourceContext } from "@/utils/nestedResources";
import { EntityConfig } from "@/components/entityManager/manager/types";

export interface ApiServiceOptions {
  requiredPermission?: string;
  checkPermissions?: boolean;
  nestedContext?: NestedResourceContext;
  entityConfig?: EntityConfig;
}

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
      const query = apiHook.useFetchData(pageParam, rest, enabled );

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
            const response = await api.post(createUrl, data);
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
            const response = await api.put(updateUrl, data);
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
            const response = await api.delete(deleteUrl);
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