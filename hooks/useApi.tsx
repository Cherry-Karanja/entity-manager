"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DjangoPaginatedResponse, ApiErrorResponse } from "@/types";
import { api, handleApiError } from "@/utils/api";

export function useApi<T, U>(url: string, pageSize: number = 10) {
  const queryClient = useQueryClient();

  // Utility function to build query string and handle URL formatting
  const buildQueryString = (params?: Record<string, number | string | string[] | boolean | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    return searchParams.toString() ? `?${searchParams.toString()}` : "";
  };

  // Simple GET (non-paginated) - fetch arbitrary JSON payloads (e.g., statistics endpoints)
  // signature: useFetch(params?, enabled?)
  const useFetch = (
    params?: Record<string, number | string | string[] | boolean | undefined>,
    enabled: boolean = true
  ) => {
    return useQuery<U, AxiosError<ApiErrorResponse>>({
      queryKey: [url, params],
      queryFn: async () => {
        const queryString = buildQueryString(params);
        const response = await api.get<U>(`${formatUrl(url)}${queryString}`);
        return response.data;
      },
      enabled,
      staleTime: 1000 * 60 * 5,
    });
  };

  // Utility function to ensure proper URL formatting
  const formatUrl = (path: string, id?: string | number) => {
    const base = url.endsWith('/') ? url : `${url}/`;
    if (id !== undefined) {
      return `${base}${id}/`;
    }
    return base;
  };

  // Fetch Paginated Data (Supports Django Pagination)
  // signature: useFetchData(page, params?, enabled?)
  const useFetchData = (page: number = 1, params?: Record<string, number | string | string[] | boolean | undefined>, enabled: boolean = true) => {
    const { page: _p, page_size = pageSize, fields, ...restParams } = params || {};
    const effectivePage = page || (_p as number) || 1
    return useQuery<DjangoPaginatedResponse<T>, AxiosError<ApiErrorResponse>>({
      queryKey: [url, effectivePage, page_size, fields, restParams],
      queryFn: async () => {
        const queryString = buildQueryString({
          page: effectivePage,
          page_size,
          fields: fields ? (Array.isArray(fields) ? fields.join(',') : fields) : undefined,
          ...restParams,
          // Handle special cases for Django
          ordering: restParams.sort_by, // Map sort_by to Django's ordering parameter
          search: restParams.search // Django's default search parameter
        });
        const response = await api.get<DjangoPaginatedResponse<T>>(`${formatUrl(url)}${queryString}`);
        return response.data;
      },
      placeholderData: (previousData: DjangoPaginatedResponse<T> | undefined) => previousData,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      enabled: enabled,
    });
  };

  // Fetch a Single Item by ID
  const useFetchById = (id: string | number, params?: Record<string, number | string | boolean | string[]>) => {
    const { fields, ...restParams } = params || {};
    return useQuery<U, AxiosError<ApiErrorResponse>>({
      queryKey: [url, id, fields, restParams],
      queryFn: async () => {
        const queryString = buildQueryString({
          fields: fields ? (Array.isArray(fields) ? fields.join(',') : fields) : undefined,
          ...restParams
        });
        const response = await api.get<U>(`${formatUrl(url, id)}${queryString}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Add Item (Supports both JSON and FormData)
  const useAddItem = useMutation<
    U,
    AxiosError<ApiErrorResponse>,
    { item?: Partial<U> | FormData; params?: Record<string, string | number | boolean> } | FormData
  >({
    mutationFn: async (arg) => {
      try {
        // Handle FormData
        if (arg instanceof FormData) {
          const response = await api.post<U>(url, arg, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data;
        }
        // Handle object with FormData
        if (arg && typeof arg === "object" && arg.item instanceof FormData) {
          const queryString = buildQueryString(arg.params);
          const response = await api.post<U>(`${url}${queryString}`, arg.item, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data;
        }
        // Handle JSON
        const queryString = buildQueryString(arg.params);
        const response = await api.post<U>(`${url}${queryString}`, arg.item);
        return response.data;
      } catch (error: any) {
        await handleApiError(error, error?.response?.data?.detail);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] });
    },
    onError: (error) => {
     handleApiError(error, error?.response?.data?.detail);
    }

  });

  // Update Item
  const useUpdateItem = useMutation<
    U, 
    AxiosError<ApiErrorResponse>, 
    { id: string | number; item: Partial<U>; params?: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ id, item, params }) => {
      try {
        const queryString = buildQueryString(params);
        const response = await api.patch<U>(`${formatUrl(url, id)}${queryString}`, item);
        return response.data;
      } catch (error: any) {
        await handleApiError(error, error?.response?.data?.detail);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] });
    },
    onError: (error) => {
     handleApiError(error, error?.response?.data?.detail);
    }
  });

  // Delete Item
  const useDeleteItem = useMutation<
    void, 
    AxiosError<ApiErrorResponse>, 
    { id: string | number; params?: Record<string, string | number | boolean> }
  >({
    mutationFn: async ({ id, params }) => {
      try {
        const queryString = buildQueryString(params);
        const baseUrl = url.endsWith('/') ? url : `${url}/`;
        if (id === '') {
          await api.delete(`${baseUrl}${queryString}`);
        } else {
          await api.delete(`${baseUrl}${id}/${queryString}`);
        }
      } catch (error: any) {
        await handleApiError(error, error?.response?.data?.detail);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] });
    },
    onError: (error) => {
     handleApiError(error, error?.response?.data?.detail);
    }
  });

  return { useFetch, useFetchData, useFetchById, useAddItem, useUpdateItem, useDeleteItem };
}