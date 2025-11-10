import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { authApi } from '@/components/connectionManager/http'

export interface RelatedDataOption {
  value: string | number
  label: string
}

export interface UseRelatedDataOptions {
  endpoint?: string;
  displayField?: string;
  valueField?: string;
  filter?: Record<string, unknown>;
  sort?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  search?: string;
  searchFields?: string[];
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Hook for fetching related data from any API endpoint
 * @param entityType - The entity type (used for query key)
 * @param options - Configuration options for the data fetch
 * @returns Query result with data, loading, error states
 */
export function useRelatedData(
  entityType: string,
  options: UseRelatedDataOptions = {}
) {
  const {
    endpoint,
    displayField = 'name',
    valueField = 'id',
    filter = {},
    sort = { field: 'name', direction: 'asc' },
    limit,
    search,
    searchFields = [displayField],
    enabled = true,
    debounceMs = 300
  } = options

  // Debounce search term
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [search, debounceMs])

  return useQuery({
    queryKey: ['relatedData', entityType, endpoint, filter, sort, limit, debouncedSearch, searchFields],
    queryFn: async (): Promise<RelatedDataOption[]> => {
      if (!endpoint) {
        throw new Error(`No endpoint provided for entity type: ${entityType}`)
      }

      // Build query parameters
      const params = new URLSearchParams()

      // Add filter parameters
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })

      // Add search parameters
      if (debouncedSearch && searchFields.length > 0) {
        params.append('search', debouncedSearch)
        searchFields.forEach(field => {
          params.append('search_fields', field)
        })
      }

      // Add sorting
      if (sort.field) {
        const sortParam = sort.direction === 'desc' ? `-${sort.field}` : sort.field
        params.append('ordering', sortParam)
      }

      // Add limit
      if (limit) {
        params.append('limit', String(limit))
      }

      const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ''}`

      const response = await authApi.get(url)

      // Transform the response data to RelatedDataOption format
      if (Array.isArray(response.data)) {
        return response.data.map((item: Record<string, unknown>) => ({
          value: item[valueField] as string | number,
          label: (item[displayField] as string) || (item.name as string) || (item.title as string) || String(item[valueField])
        }))
      }

      // Handle paginated responses
      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data.results.map((item: Record<string, unknown>) => ({
          value: item[valueField] as string | number,
          label: (item[displayField] as string) || (item.name as string) || (item.title as string) || String(item[valueField])
        }))
      }

      return []
    },
    enabled: enabled && !!endpoint,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}