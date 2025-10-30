import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export interface RelatedDataOption {
  value: string | number
  label: string
}

export interface UseRelatedDataOptions {
  endpoint?: string
  displayField?: string
  valueField?: string
  filter?: Record<string, unknown>
  sort?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
  enabled?: boolean
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
    enabled = true
  } = options

  return useQuery({
    queryKey: ['relatedData', entityType, endpoint, filter, sort, limit],
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

      const response = await api.get(url)

      // Transform the response data to RelatedDataOption format
      if (Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          value: item[valueField],
          label: item[displayField] || item.name || item.title || String(item[valueField])
        }))
      }

      // Handle paginated responses
      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data.results.map((item: any) => ({
          value: item[valueField],
          label: item[displayField] || item.name || item.title || String(item[valueField])
        }))
      }

      return []
    },
    enabled: enabled && !!endpoint,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}