"use client";

import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { DjangoPaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import * as ApiService from './apiConfig'
import { api } from "@/utils/api";

export interface ApiServiceOptions {
  requiredPermission?: string;
  checkPermissions?: boolean;
}

export function createApiService<T, U = T>(url: string, options: ApiServiceOptions = {}) {
  const {
    requiredPermission,
    checkPermissions = true,
  } = options;

  // Return a hook that can be used in components
  return function useEntityApi(pageSize: number = 10) {
    const api = useApi<T, U>(url, pageSize);
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
      const query = api.useFetchData(pageParam, rest, enabled );

      return {
        ...query,
        data: query.data ? {
          ...query.data,
          results: query.data.results || []
        } : undefined
      };
    };

    const useFetchById = (id: string | number) => {
      return api.useFetchById(id);
    };

    const useAddItem = () => {
      return api.useAddItem;
    };

    const useUpdateItem = () => {
      return api.useUpdateItem;
    };

    const useDeleteItem = () => {
      return api.useDeleteItem;
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