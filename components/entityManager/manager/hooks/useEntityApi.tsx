'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { createApiService } from '@/handler/ApiService'
import { EntityConfig, BaseEntity } from '../types'
import { EntityState, EntityStateActions } from './useEntityState'
import { api } from '../../../../utils/api'
import { DjangoPaginatedResponse } from '../../../../types'

// ===== TYPES =====

export interface UseEntityApiOptions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  config: EntityConfig<TEntity, TFormData>
  state: EntityState<TEntity>
  actions: EntityStateActions<TEntity>
  enableOptimisticUpdates?: boolean
  enableRequestDeduplication?: boolean
  retryAttempts?: number
  retryDelay?: number
  cacheTimeout?: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: ApiError
  timestamp: number
}

export interface EntityApiActions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  // Data fetching
  fetchEntities: (force?: boolean) => Promise<void>
  fetchEntityById: (id: string | number) => Promise<TEntity | null>

  // CRUD operations
  createEntity: (data: TFormData) => Promise<TEntity | null>
  updateEntity: (id: string | number, data: Partial<TFormData>) => Promise<TEntity | null>
  deleteEntity: (id: string | number) => Promise<boolean>

  // Batch operations
  batchDeleteEntities: (ids: (string | number)[]) => Promise<boolean>
  batchUpdateEntities: (updates: Array<{ id: string | number; data: Partial<TFormData> }>) => Promise<boolean>

  // Export operations
  exportEntities: (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, unknown>) => Promise<Blob | null>

  // Utility operations
  invalidateCache: () => void
  cancelPendingRequests: () => void
  retryFailedOperation: (operation: () => Promise<unknown>) => Promise<unknown>
}

// ===== CONSTANTS =====

const DEFAULT_RETRY_ATTEMPTS = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second
const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const REQUEST_DEDUPLICATION_TIMEOUT = 5000 // 5 seconds

// ===== UTILITY FUNCTIONS =====

function createApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      details: { originalError: error }
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR'
    }
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'API Error',
      code: axiosError.response?.data?.code || 'API_ERROR',
      statusCode: axiosError.response?.status,
      details: axiosError.response?.data
    }
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: { error }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ===== HOOK IMPLEMENTATION =====

export function useEntityApi<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>({
  config,
  state,
  actions,
  enableOptimisticUpdates = true,
  enableRequestDeduplication = true,
  retryAttempts = DEFAULT_RETRY_ATTEMPTS,
  retryDelay = DEFAULT_RETRY_DELAY,
  cacheTimeout = DEFAULT_CACHE_TIMEOUT
}: UseEntityApiOptions<TEntity, TFormData>) {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  // Request management
  const abortControllerRef = useRef<AbortController | null>(null)
  const pendingRequestsRef = useRef<Map<string, Promise<unknown>>>(new Map())
  const requestCacheRef = useRef<Map<string, { data: unknown; timestamp: number }>>(new Map())

  // Create API services for mutations - call hooks at top level
  const createApi = createApiService<TFormData, TEntity>(
    config.endpoints.create,
    { checkPermissions: false }
  )()
  const updateApi = createApiService<TFormData, TEntity>(
    config.endpoints.update,
    { checkPermissions: false }
  )()
  const deleteApi = createApiService<{ id: string | number }, null>(
    config.endpoints.delete,
    { checkPermissions: false }
  )()

  // Get mutation hooks - call them at top level
  const addItemMutation = createApi.useAddItem()
  const updateItemMutation = updateApi.useUpdateItem()
  const deleteItemMutation = deleteApi.useDeleteItem()

  // Create API services object for mutations
  const apiServices = useMemo(() => ({
    create: createApi,
    update: updateApi,
    delete: deleteApi,
    mutations: {
      addItem: addItemMutation,
      updateItem: updateItemMutation,
      deleteItem: deleteItemMutation
    }
  }), [createApi, updateApi, deleteApi, addItemMutation, updateItemMutation, deleteItemMutation])

  // Utility function to format URLs with ID placeholders
  const formatUrl = useCallback((urlTemplate: string, id?: string | number): string => {
    if (id !== undefined && urlTemplate.includes('{id}')) {
      return urlTemplate.replace('{id}', String(id))
    }
    // Fallback for URLs without placeholders
    const base = urlTemplate.endsWith('/') ? urlTemplate : `${urlTemplate}/`
    if (id !== undefined) {
      return `${base}${id}/`
    }
    return base
  }, [])

  // Utility function to build query string
  const buildQueryString = useCallback((params?: Record<string, number | string | string[] | boolean | undefined>): string => {
    const searchParams = new URLSearchParams()
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)))
          } else {
            searchParams.append(key, String(value))
          }
        }
      })
    }
    return searchParams.toString() ? `?${searchParams.toString()}` : ''
  }, [])

  // Check if cache is valid
  const isCacheValid = useCallback((timestamp: number): boolean => {
    return Date.now() - timestamp < cacheTimeout
  }, [cacheTimeout])

  // Request deduplication
  const getDeduplicatedRequest = useCallback(<T,>(key: string, requestFn: () => Promise<T>): Promise<T> => {
    if (!enableRequestDeduplication) {
      return requestFn()
    }

    const existingRequest = pendingRequestsRef.current.get(key)
    if (existingRequest) {
      return existingRequest as Promise<T>
    }

    const request = requestFn().finally(() => {
      pendingRequestsRef.current.delete(key)
    })

    pendingRequestsRef.current.set(key, request)

    // Clean up after timeout
    setTimeout(() => {
      pendingRequestsRef.current.delete(key)
    }, REQUEST_DEDUPLICATION_TIMEOUT)

    return request
  }, [enableRequestDeduplication])

  // Retry logic with exponential backoff
  const retryWithBackoff = useCallback(async <T,>(
    operation: () => Promise<T>,
    attempts: number = retryAttempts,
    baseDelay: number = retryDelay
  ): Promise<T> => {
    let lastError: unknown

    for (let i = 0; i < attempts; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error

        // Don't retry on client errors (4xx)
        if (error && typeof error === 'object' && 'response' in error) {
          const status = (error as any).response?.status
          if (status && status >= 400 && status < 500) {
            throw error
          }
        }

        if (i < attempts - 1) {
          await delay(baseDelay * Math.pow(2, i))
        }
      }
    }

    throw lastError
  }, [retryAttempts, retryDelay])

  // Generate cache key for pagination
  const getCacheKey = useCallback((): string => {
    const params = {
      page: state.currentPage,
      page_size: state.pageSize,
      search: state.debouncedSearchTerm,
      ordering: state.sortConfig ? `${state.sortConfig.direction === 'desc' ? '-' : ''}${state.sortConfig.key}` : undefined,
      ...state.filterValues
    }
    return JSON.stringify(params)
  }, [state.currentPage, state.pageSize, state.debouncedSearchTerm, state.sortConfig, state.filterValues])

  // Imperative fetch function for list data with caching
  const fetchListData = useCallback(async (params: Record<string, unknown>): Promise<DjangoPaginatedResponse<TEntity>> => {
    const queryString = buildQueryString(params as Record<string, number | string | string[] | boolean | undefined>)
    // If the configured list endpoint already contains a query string, join using & instead of ?
    let url = config.endpoints.list
    if (queryString) {
      if (url.includes('?')) {
        // endpoint already has ?; append remaining params with & (strip leading '?')
        url = `${url}&${queryString.slice(1)}`
      } else {
        url = `${url}${queryString}`
      }
    }
    const cacheKey = `list:${url}`

    // Check cache first
    const cached = requestCacheRef.current.get(cacheKey)
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data as DjangoPaginatedResponse<TEntity>
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      console.log('Making API request to:', url)
      const response = await api.get<DjangoPaginatedResponse<TEntity>>(url)
      console.log('API response received:', response.data)

      // Cache the response
      requestCacheRef.current.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })

      return response.data
    } catch (error) {
      console.error('API request failed:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw error
    }
  }, [config.endpoints.list, buildQueryString, isCacheValid])

  // Imperative fetch function for single entity with caching
  const fetchSingleEntity = useCallback(async (id: string | number): Promise<TEntity> => {
    const url = formatUrl(config.endpoints.list, id)
    const cacheKey = `single:${url}`

    // Check cache first
    const cached = requestCacheRef.current.get(cacheKey)
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data as TEntity
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await api.get<TEntity>(url, {
        signal: abortControllerRef.current.signal
      })

      // Cache the response
      requestCacheRef.current.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })

      return response.data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw error
    }
  }, [config.endpoints.list, formatUrl, isCacheValid])

  // ===== UTILITY FUNCTIONS =====

  // Cache invalidation
  const invalidateCache = useCallback(() => {
    requestCacheRef.current.clear()
    actions.clearPaginationCache()
  }, [actions])

  // Cancel pending requests
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    pendingRequestsRef.current.clear()
  }, [])

  // Retry failed operation
  const retryFailedOperation = useCallback(async (operation: () => Promise<unknown>): Promise<unknown> => {
    return retryWithBackoff(operation)
  }, [retryWithBackoff])

  // ===== CRUD OPERATIONS =====

  // Fetch entities with deduplication and caching
  const fetchEntities = useCallback(async (force = false): Promise<void> => {
    const cacheKey = getCacheKey()
    const requestKey = `fetchEntities:${cacheKey}`

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      const cached = state.paginationCache[cacheKey]
      if (!force && cached && isCacheValid(cached.timestamp)) {
        return
      }

      await getDeduplicatedRequest(requestKey, async () => {
        const params = {
          page: state.currentPage,
          page_size: state.pageSize,
          search: state.debouncedSearchTerm,
          ordering: state.sortConfig ? `${state.sortConfig.direction === 'desc' ? '-' : ''}${state.sortConfig.key}` : undefined,
          ...state.filterValues
        }

        const response = await retryWithBackoff(() => fetchListData(params))
        actions.updatePaginationCache(cacheKey, response)
        actions.setHasLoadedOnce(true)
      })
    } catch (err) {
      console.error('Error in fetchEntities:', err)
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }, [state, actions, getCacheKey, isCacheValid, getDeduplicatedRequest, retryWithBackoff, fetchListData])

  // Fetch single entity with deduplication
  const fetchEntityById = useCallback(async (id: string | number): Promise<TEntity | null> => {
    const requestKey = `fetchEntityById:${id}`

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      const result = await getDeduplicatedRequest(requestKey, async () => {
        return await retryWithBackoff(() => fetchSingleEntity(id))
      })

      return result as TEntity
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [getDeduplicatedRequest, retryWithBackoff, fetchSingleEntity, actions])

  // Create entity with optimistic updates
  const createEntity = useCallback(async (data: TFormData): Promise<TEntity | null> => {
    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      const result = await retryWithBackoff(async () => {
        const response = await apiServices.mutations.addItem.mutateAsync({ item: data as Partial<TEntity> })
        return response
      })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      return result as TEntity
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.addItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

  // Update entity with optimistic updates
  const updateEntity = useCallback(async (id: string | number, data: Partial<TFormData>): Promise<TEntity | null> => {
    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      const result = await retryWithBackoff(async () => {
        const response = await apiServices.mutations.updateItem.mutateAsync({
          id,
          item: data as unknown as Partial<TEntity>
        })
        return response
      })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      return result as TEntity
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.updateItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

  // Delete entity with optimistic updates
  const deleteEntity = useCallback(async (id: string | number): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      await retryWithBackoff(async () => {
        await apiServices.mutations.deleteItem.mutateAsync({ id })
      })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      return true
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.deleteItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

  // Batch delete with progress tracking
  const batchDeleteEntities = useCallback(async (ids: (string | number)[]): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      const results = await Promise.allSettled(
        ids.map(id => retryWithBackoff(() => apiServices.mutations.deleteItem.mutateAsync({ id })))
      )

      const failures = results.filter(result => result.status === 'rejected')
      if (failures.length > 0) {
        throw new Error(`${failures.length} out of ${ids.length} deletions failed`)
      }

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)
      return true
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.deleteItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

  // Batch update with progress tracking
  const batchUpdateEntities = useCallback(async (updates: Array<{ id: string | number; data: Partial<TFormData> }>): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      const results = await Promise.allSettled(
        updates.map(update =>
          retryWithBackoff(() =>
            apiServices.mutations.updateItem.mutateAsync({
              id: update.id,
              item: update.data as unknown as Partial<TEntity>
            })
          )
        )
      )

      const failures = results.filter(result => result.status === 'rejected')
      if (failures.length > 0) {
        throw new Error(`${failures.length} out of ${updates.length} updates failed`)
      }

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)
      return true
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.updateItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

  // Export entities (placeholder implementation)
  const exportEntities = useCallback(async (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, unknown>): Promise<Blob | null> => {
    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      // Build export URL
      const params = {
        export: format,
        ...filters
      }
      const queryString = buildQueryString(params)
      const url = `${config.endpoints.list}export/${queryString}`

      const response = await api.get(url, {
        responseType: 'blob'
      })

      return response.data as Blob
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [config.endpoints.list, buildQueryString, actions])

  // ===== UTILITY FUNCTIONS =====

  // API actions object
  const apiActions: EntityApiActions<TEntity, TFormData> = useMemo(() => ({
    fetchEntities,
    fetchEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    batchDeleteEntities,
    batchUpdateEntities,
    exportEntities,
    invalidateCache,
    cancelPendingRequests,
    retryFailedOperation
  }), [
    fetchEntities,
    fetchEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    batchDeleteEntities,
    batchUpdateEntities,
    exportEntities,
    invalidateCache,
    cancelPendingRequests,
    retryFailedOperation
  ])

  return {
    isLoading,
    error,
    ...apiActions
  }
}