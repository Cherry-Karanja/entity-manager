'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { createApiService } from '@/handler/ApiService'
import { EntityConfig, BaseEntity } from '../types'
import { EntityState, EntityStateActions } from './useEntityState'
import { api } from '../../../../utils/api'
import { DjangoPaginatedResponse } from '../../../../types'
import { EntityListSort } from '../../EntityList/types'
import { buildCompleteQueryParams } from '../../../../utils/queryBuilding'
import { analyzeCascadeOperations, executeCascadeOperations, CascadeOperation, CascadeResult } from '../../../../utils/cascadeOperations'
import { offlineStorage, useOfflineState, OfflineOperation, SyncResult, startAutoSync, stopAutoSync } from '../../../../utils/offlineStorage'
import { useEntityWebSocket } from '../../../../hooks/useWebSocket'
import { MessageType } from '../../../../types/websocket'
import { ConnectionState } from '../../../../types/websocket'
import { OptimisticOperation, OptimisticState, OptimisticConfig, ConflictResolution, OptimisticApiResult } from '../../utils/types/optimistic'
import { ConflictResolutionDialog, ConflictNotification } from '../../utils/ConflictResolution'
import { UserPresenceData, CursorPosition, EntityLock } from '../../utils/types/collaborative'

// ===== UTILITY FUNCTIONS =====

function buildOrderingParam(sortConfig?: readonly EntityListSort[]): string | undefined {
  if (!sortConfig || sortConfig.length === 0) return undefined
  return sortConfig.map(s => `${s.direction === 'desc' ? '-' : ''}${s.field}`).join(',')
}

// ===== TYPES =====

export interface UseEntityApiOptions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  config: EntityConfig<TEntity, TFormData>
  state: EntityState<TEntity>
  actions: EntityStateActions<TEntity>
  enableOptimisticUpdates?: boolean
  enableRequestDeduplication?: boolean
  retryAttempts?: number
  retryDelay?: number
  enableRealTimeUpdates?: boolean
  webSocketUrl?: string
  authToken?: string
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

export interface ValidationErrors {
  fieldErrors: Record<string, string[]>
  nonFieldErrors: string[]
}

export interface EntityOperationSuccess<TEntity> {
  success: true
  data: TEntity
}

export interface EntityOperationFailure {
  success: false
  validationErrors: ValidationErrors
}

export type EntityOperationResult<TEntity> = EntityOperationSuccess<TEntity> | EntityOperationFailure

export interface BulkOperationProgress {
  total: number
  completed: number
  failed: number
  currentItem?: string | number
  errors: Array<{ id: string | number; error: string }>
}

export interface BulkOperationResult {
  success: boolean
  totalProcessed: number
  successful: number
  failed: number
  errors: Array<{ id: string | number; error: string }>
  duration: number
}

export interface EntityApiActions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  // Data fetching
  fetchEntities: (force?: boolean) => Promise<void>
  fetchEntityById: (id: string | number) => Promise<TEntity | null>

  // CRUD operations
  createEntity: (data: TFormData) => Promise<EntityOperationResult<TEntity>>
  updateEntity: (id: string | number, data: Partial<TFormData>) => Promise<EntityOperationResult<TEntity>>
  deleteEntity: (id: string | number) => Promise<boolean>

  // Batch operations
  batchDeleteEntities: (ids: (string | number)[], onProgress?: (progress: BulkOperationProgress) => void) => Promise<BulkOperationResult>
  batchUpdateEntities: (updates: Array<{ id: string | number; data: Partial<TFormData> }>, onProgress?: (progress: BulkOperationProgress) => void) => Promise<BulkOperationResult>
  batchCreateEntities: (items: TFormData[], onProgress?: (progress: BulkOperationProgress) => void) => Promise<BulkOperationResult>

  // Export operations
  exportEntities: (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, unknown>) => Promise<Blob | null>

  // Offline sync operations
  syncPendingOperations: () => Promise<SyncResult>

  // Cascade operations
  analyzeCascadeOperations: (entityType: string, entityId: string, operation: 'delete' | 'update' | 'archive') => Promise<CascadeOperation[]>
  executeCascadeOperations: (operations: CascadeOperation[]) => Promise<CascadeResult>
}

export interface UseEntityApiReturn<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> extends EntityApiActions<TEntity, TFormData> {
  isLoading: boolean
  error: ApiError | null
  offlineState: ReturnType<typeof useOfflineState>
  realTimeState: {
    isConnected: boolean
    connectionState: ConnectionState
    queuedMessagesCount: number
  }
  presenceState: {
    currentUser: { id: string; name: string } | null
    viewers: Array<{ userId: string; userName: string; lastActivity: number }>
    editors: Array<{ userId: string; userName: string; entityId: string | number; lastActivity: number }>
    activeUsers: UserPresenceData[]
    entityLocks: EntityLock[]
    userCursors: CursorPosition[]
  }
  presenceActions: {
    updatePresenceViewing: (entityId: string | number) => void
    updatePresenceEditing: (entityId: string | number, action: 'start' | 'stop') => void
  }
  optimisticState: OptimisticState
  optimisticActions: {
    rollbackOperation: (operationId: string) => void
    retryOperation: (operationId: string) => Promise<void>
    clearFailedOperations: () => void
    resolveConflict: (conflictId: string, resolution: ConflictResolution) => Promise<void>
    dismissConflict: (conflictId: string) => void
  }
  conflictUI: {
    ConflictResolutionDialog: React.ComponentType<any>
    ConflictNotification: React.ComponentType<any>
  }
}

// ===== CONSTANTS =====

const DEFAULT_RETRY_ATTEMPTS = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second
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

// ===== OPTIMISTIC UI UTILITIES =====

function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateOperationId(entityType: string, operation: string, entityId?: string | number): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${entityType}_${operation}_${entityId || 'new'}_${timestamp}_${random}`
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
  enableRealTimeUpdates = false,
  webSocketUrl,
  authToken
}: UseEntityApiOptions<TEntity, TFormData>): UseEntityApiReturn<TEntity, TFormData> {
  // Note: enableOptimisticUpdates is reserved for future optimistic UI updates implementation
  console.log('Optimistic updates enabled:', enableOptimisticUpdates) // Temporary usage to avoid ESLint warning

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  // Offline state management
  const offlineState = useOfflineState()

  // Message handler ref for WebSocket
  const messageHandlerRef = useRef<(message: any) => void>(() => {})

  // Real-time updates via WebSocket
  const webSocket = useEntityWebSocket({
    url: webSocketUrl || '',
    // No authToken needed - authentication handled via HTTP-only cookies
    entityType: config.name,
    autoConnect: enableRealTimeUpdates && !!webSocketUrl,
    onMessage: (message) => messageHandlerRef.current(message)
  })

  // Presence tracking
  const [presenceState, setPresenceState] = useState<{
    currentUser: { id: string; name: string } | null
    viewers: Array<{ userId: string; userName: string; lastActivity: number }>
    editors: Array<{ userId: string; userName: string; entityId: string | number; lastActivity: number }>
    activeUsers: UserPresenceData[]
    entityLocks: EntityLock[]
    userCursors: CursorPosition[]
  }>({
    currentUser: null, // This would be set from auth context
    viewers: [],
    editors: [],
    activeUsers: [],
    entityLocks: [],
    userCursors: []
  })

  // Optimistic UI updates state
  const [optimisticState, setOptimisticState] = useState<OptimisticState>({
    operations: new Map(),
    conflicts: [],
    pendingCount: 0,
    failedCount: 0,
    lastSyncTimestamp: Date.now()
  })

  // Optimistic configuration
  const optimisticConfig: OptimisticConfig = useMemo(() => ({
    enabled: enableOptimisticUpdates,
    autoRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    conflictResolution: 'last-write-wins',
    showPendingIndicators: true,
    rollbackOnFailure: true
  }), [enableOptimisticUpdates])

  // Send presence message
  const sendPresenceMessage = useCallback((type: MessageType, entityId?: string | number, action?: string) => {
    if (enableRealTimeUpdates && webSocket.isConnected && presenceState.currentUser) {
      webSocket.sendMessage({
        type,
        payload: {
          userId: presenceState.currentUser.id,
          userName: presenceState.currentUser.name,
          entityType: config.name,
          entityId,
          action,
          lastActivity: Date.now()
        }
      } as any)
    }
  }, [enableRealTimeUpdates, webSocket, presenceState.currentUser, config.name])

  // Update presence when viewing an entity
  const updatePresenceViewing = useCallback((entityId: string | number) => {
    sendPresenceMessage(MessageType.USER_VIEWING, entityId, 'view')
  }, [sendPresenceMessage])

  // Update presence when editing an entity
  const updatePresenceEditing = useCallback((entityId: string | number, action: 'start' | 'stop' = 'start') => {
    const messageType = action === 'start' ? MessageType.USER_EDITING_STARTED : MessageType.USER_EDITING_STOPPED
    sendPresenceMessage(messageType, entityId, action)
  }, [sendPresenceMessage])

  // Handle presence messages from other users
  const handlePresenceMessage = useCallback((message: any) => {
    if (!presenceState.currentUser || message.userId === presenceState.currentUser.id) {
      return // Ignore our own messages
    }

    const presenceData = {
      userId: message.userId,
      userName: message.userName || 'Unknown User',
      lastActivity: Date.now()
    }

    setPresenceState(prev => {
      const newState = { ...prev }

      switch (message.type) {
        case MessageType.USER_VIEWING:
          // Add or update viewer
          newState.viewers = newState.viewers.filter(v => v.userId !== message.userId)
          newState.viewers.push(presenceData)
          break

        case MessageType.USER_EDITING_STARTED:
          // Add or update editor
          newState.editors = newState.editors.filter(e => !(e.userId === message.userId && e.entityId === message.entityId))
          newState.editors.push({
            ...presenceData,
            entityId: message.entityId
          })
          break

        case MessageType.USER_EDITING_STOPPED:
          // Remove editor
          newState.editors = newState.editors.filter(e => !(e.userId === message.userId && e.entityId === message.entityId))
          break

        case MessageType.USER_LEFT:
          // Remove from both viewers and editors
          newState.viewers = newState.viewers.filter(v => v.userId !== message.userId)
          newState.editors = newState.editors.filter(e => e.userId !== message.userId)
          break
      }

      // Clean up old presence data (older than 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      newState.viewers = newState.viewers.filter(v => v.lastActivity > fiveMinutesAgo)
      newState.editors = newState.editors.filter(e => e.lastActivity > fiveMinutesAgo)

      return newState
    })
  }, [presenceState.currentUser])

  // Request management
  const abortControllerRef = useRef<AbortController | null>(null)
  const pendingRequestsRef = useRef<Map<string, Promise<unknown>>>(new Map())

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
      ordering: buildOrderingParam(state.sortConfig),
      fields: state.fields,
      expand: state.expand,
      ...state.filterValues
    }
    return JSON.stringify(params)
  }, [state.currentPage, state.pageSize, state.debouncedSearchTerm, state.sortConfig, state.filterValues, state.fields, state.expand])

  // Initialize auto-sync for offline operations
  useEffect(() => {
    // Start auto-sync when component mounts
    startAutoSync(30000) // 30 second intervals

    // Cleanup on unmount
    return () => {
      stopAutoSync()
    }
  }, [])

  // Imperative fetch function for list data (using TanStack Query caching)
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

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await api.get<DjangoPaginatedResponse<TEntity>>(url, {
        signal: abortControllerRef.current.signal
      })

      return response.data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw error
    }
  }, [config.endpoints.list, buildQueryString])

  // Imperative fetch function for single entity
  const fetchSingleEntity = useCallback(async (id: string | number): Promise<TEntity> => {
    const url = formatUrl(config.endpoints.list, id)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await api.get<TEntity>(url, {
        signal: abortControllerRef.current.signal
      })

      return response.data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw error
    }
  }, [config.endpoints.list, formatUrl])

  // ===== UTILITY FUNCTIONS =====

  // Cache invalidation
  const invalidateCache = useCallback(() => {
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

  // ===== OPTIMISTIC UI OPERATIONS =====

  // Add optimistic operation
  const addOptimisticOperation = useCallback((
    operation: Omit<OptimisticOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>
  ) => {
    const optimisticOp: OptimisticOperation = {
      ...operation,
      id: generateOperationId(operation.entityType, operation.type, operation.entityId),
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    }

    setOptimisticState(prev => ({
      ...prev,
      operations: new Map(prev.operations).set(optimisticOp.id, optimisticOp),
      pendingCount: prev.pendingCount + 1
    }))

    return optimisticOp.id
  }, [])

  // Update optimistic operation status
  const updateOptimisticOperation = useCallback((
    operationId: string,
    updates: Partial<Pick<OptimisticOperation, 'status' | 'error' | 'serverData' | 'retryCount'>>
  ) => {
    setOptimisticState(prev => {
      const operations = new Map(prev.operations)
      const operation = operations.get(operationId)

      if (!operation) return prev

      const updatedOperation = { ...operation, ...updates }
      operations.set(operationId, updatedOperation)

      let pendingCount = prev.pendingCount
      let failedCount = prev.failedCount

      if (updates.status === 'confirmed' && operation.status === 'pending') {
        pendingCount--
      } else if (updates.status === 'failed' && operation.status !== 'failed') {
        pendingCount--
        failedCount++
      } else if (updates.status === 'rolled_back' && operation.status === 'failed') {
        failedCount--
      }

      return {
        ...prev,
        operations,
        pendingCount: Math.max(0, pendingCount),
        failedCount: Math.max(0, failedCount)
      }
    })
  }, [])

  // Remove optimistic operation
  const removeOptimisticOperation = useCallback((operationId: string) => {
    setOptimisticState(prev => {
      const operations = new Map(prev.operations)
      const operation = operations.get(operationId)

      if (!operation) return prev

      operations.delete(operationId)

      let pendingCount = prev.pendingCount
      let failedCount = prev.failedCount

      if (operation.status === 'pending') {
        pendingCount--
      } else if (operation.status === 'failed') {
        failedCount--
      }

      return {
        ...prev,
        operations,
        pendingCount: Math.max(0, pendingCount),
        failedCount: Math.max(0, failedCount)
      }
    })
  }, [])

  // ===== CRUD OPERATIONS =====

  // Fetch entities with deduplication
  const fetchEntities = useCallback(async (force = false): Promise<void> => {
    const cacheKey = getCacheKey()
    const requestKey = `fetchEntities:${cacheKey}`

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      await getDeduplicatedRequest(requestKey, async () => {
        const params = buildCompleteQueryParams({
          page: state.currentPage,
          pageSize: state.pageSize,
          search: state.debouncedSearchTerm,
          sortBy: buildOrderingParam(state.sortConfig),
          filters: config.listConfig.filters || [],
          filterValues: state.filterValues,
          fields: state.fields,
          expand: state.expand
        })

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
  }, [state, actions, getCacheKey, getDeduplicatedRequest, retryWithBackoff, fetchListData])

  // Provide a stable reference to fetchEntities for consumers so they can safely
  // include it in effect dependency arrays without creating loops when the
  // internal fetch function identity changes. We keep the original
  // implementation for internal usage but export a stable wrapper that calls
  // the latest implementation stored in a ref.
  const fetchEntitiesRef = useRef(fetchEntities)
  // update ref whenever fetchEntities changes
  useEffect(() => {
    fetchEntitiesRef.current = fetchEntities
  }, [fetchEntities])

  const fetchEntitiesStable = useCallback(async (force = false) => {
    return fetchEntitiesRef.current(force)
  }, [])

  // Rollback optimistic operation
  const rollbackOptimisticOperation = useCallback((operationId: string) => {
    const operation = optimisticState.operations.get(operationId)
    if (!operation) return

    // Update operation status
    updateOptimisticOperation(operationId, { status: 'rolled_back' })

    // For rollback, we need to refresh the data from server
    // This is a simplified approach - in a full implementation,
    // we'd maintain server state snapshots for precise rollback
    switch (operation.type) {
      case 'create':
        if (operation.tempId) {
          // For create rollback, we need to clear cache and refetch
          // since we don't have direct entity removal in the actions
          actions.clearPaginationCache()
          fetchEntitiesStable(true)
        }
        break
      case 'update':
      case 'delete':
        // For update/delete rollback, refresh data from server
        actions.clearPaginationCache()
        fetchEntitiesStable(true)
        break
    }

    // Remove operation after rollback
    setTimeout(() => removeOptimisticOperation(operationId), 1000)
  }, [optimisticState.operations, updateOptimisticOperation, removeOptimisticOperation, actions, fetchEntitiesStable])

  // Resolve conflict with user-selected resolution
  const resolveConflict = useCallback(async (conflictId: string, resolution: ConflictResolution) => {
    try {
      // Find the conflict
      const conflict = optimisticState.conflicts.find(c => c.operationId === conflictId)
      if (!conflict) return

      // Apply the resolution
      let resolvedData = conflict.localData
      if (resolution.resolution === 'server') {
        resolvedData = conflict.serverData
      } else if (resolution.resolution === 'merge' && resolution.resolvedData) {
        resolvedData = resolution.resolvedData
      }

      // Update the entity with resolved data
      if (conflict.entityId) {
        await apiServices.mutations.updateItem.mutateAsync({
          id: conflict.entityId,
          data: resolvedData as any
        })
      }

      // Remove the conflict from state
      setOptimisticState(prev => ({
        ...prev,
        conflicts: prev.conflicts.filter(c => c.operationId !== conflictId)
      }))

      // Refresh data to ensure consistency
      actions.clearPaginationCache()
      fetchEntitiesStable(true)

    } catch (error) {
      console.error('Failed to resolve conflict:', error)
      // Keep the conflict in state for retry
    }
  }, [optimisticState.conflicts, apiServices.mutations, actions])

  // Dismiss conflict without resolving
  const dismissConflict = useCallback((conflictId: string) => {
    setOptimisticState(prev => ({
      ...prev,
      conflicts: prev.conflicts.filter(c => c.operationId !== conflictId)
    }))
  }, [])

  // Detect and add conflict to state
  const detectConflict = useCallback((
    operationId: string,
    localData: Record<string, unknown>,
    serverData: Record<string, unknown>,
    conflictFields: string[] = []
  ) => {
    const operation = optimisticState.operations.get(operationId)
    if (!operation) return

    // Check for version-based conflicts
    const hasVersionConflict = localData.version && serverData.version &&
                              localData.version !== serverData.version

    // If no specific conflict fields provided, detect them by comparing data
    const detectedFields = conflictFields.length > 0 ? conflictFields :
      Object.keys(localData).filter(key =>
        key !== 'version' && // Exclude version field from comparison
        JSON.stringify(localData[key]) !== JSON.stringify(serverData[key])
      )

    // Include version conflict if detected
    if (hasVersionConflict) {
      detectedFields.unshift('version')
    }

    const conflict: ConflictResolution = {
      operationId,
      entityType: operation.entityType,
      entityId: operation.entityId || '',
      localData,
      serverData,
      conflictFields: detectedFields,
      resolution: 'manual', // Default to manual resolution
      timestamp: Date.now()
    }

    setOptimisticState(prev => ({
      ...prev,
      conflicts: [...prev.conflicts, conflict]
    }))

    // Mark operation as failed due to conflict
    updateOptimisticOperation(operationId, {
      status: 'failed',
      error: hasVersionConflict
        ? `Version conflict detected (local: ${localData.version}, server: ${serverData.version})`
        : `Conflict detected in fields: ${detectedFields.join(', ')}`
    })
  }, [optimisticState.operations, updateOptimisticOperation])

  // Perform optimistic create operation
  const performOptimisticCreate = useCallback(async (data: TFormData): Promise<EntityOperationResult<TEntity>> => {
    const tempId = generateTempId()
    const operationId = generateOperationId(config.name, 'create', tempId)

    // Create optimistic operation
    const optimisticOperation: OptimisticOperation = {
      id: operationId,
      type: 'create',
      entityType: config.name,
      entityId: tempId,
      tempId,
      localData: data as Record<string, unknown>,
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0
    }

    // Add to optimistic state
    addOptimisticOperation(optimisticOperation)

    // Immediately update UI with optimistic data
    // Note: In a full implementation, this would add the entity to the local state
    // For now, we'll rely on cache invalidation after server confirmation

    try {
      // Perform server operation
      const result = await retryWithBackoff(async () => {
        const response = await apiServices.mutations.addItem.mutateAsync(data as unknown as TEntity)
        return response
      })

      // Update operation as successful
      updateOptimisticOperation(operationId, { status: 'confirmed' })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntitiesStable(true)

      // Send real-time update via WebSocket
      if (enableRealTimeUpdates && webSocket.isConnected) {
        webSocket.sendMessage({
          type: MessageType.ENTITY_CREATED,
          payload: {
            entityType: config.name,
            entityId: (result as any)?.id,
            entityData: result
          }
        } as any)
      }

      // Remove operation after success
      setTimeout(() => removeOptimisticOperation(operationId), 2000)

      return { success: true as const, data: result as TEntity }
    } catch (err) {
      const apiError = createApiError(err)

      // Update operation as failed
      updateOptimisticOperation(operationId, { status: 'failed', error: apiError.message })

      // Rollback optimistic changes
      rollbackOptimisticOperation(operationId)

      return { success: false as const, validationErrors: { fieldErrors: {}, nonFieldErrors: [apiError.message] } }
    }
  }, [config.name, addOptimisticOperation, updateOptimisticOperation, removeOptimisticOperation, rollbackOptimisticOperation, retryWithBackoff, apiServices.mutations.addItem, invalidateCache, fetchEntitiesStable, enableRealTimeUpdates, webSocket])

  // Perform optimistic update operation
  const performOptimisticUpdate = useCallback(async (id: string | number, data: Partial<TFormData>): Promise<EntityOperationResult<TEntity>> => {
    const operationId = generateOperationId(config.name, 'update', id)

    // Get current entity data for rollback purposes (from cache if available)
    let currentData: Record<string, unknown> = {}
    const cacheKey = getCacheKey()
    const cachedPage = state.paginationCache[cacheKey]
    if (cachedPage?.data?.results) {
      const entity = cachedPage.data.results.find((item: any) => item.id === id)
      if (entity) {
        currentData = entity as Record<string, unknown>
      }
    }

    // Create optimistic operation
    const optimisticOperation: OptimisticOperation = {
      id: operationId,
      type: 'update',
      entityType: config.name,
      entityId: id,
      localData: data as Record<string, unknown>,
      serverData: currentData,
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0
    }

    // Add to optimistic state
    addOptimisticOperation(optimisticOperation)

    // Immediately update UI with optimistic data
    // Note: In a full implementation, this would merge the update into the local state
    // For now, we'll rely on cache invalidation after server confirmation

    // Check for version conflicts before making server request
    if (currentData.version && data.version && currentData.version !== data.version) {
      // Version conflict detected - create conflict immediately
      detectConflict(operationId, data as Record<string, unknown>, currentData, ['version'])
      return { success: false as const, validationErrors: { fieldErrors: {}, nonFieldErrors: ['Version conflict detected - please resolve manually'] } }
    }

    try {
      // Perform server operation
      const result = await retryWithBackoff(async () => {
        const response = await apiServices.mutations.updateItem.mutateAsync({ id, data: data as unknown as TEntity })
        return response
      })

      // Update operation as successful
      updateOptimisticOperation(operationId, { status: 'confirmed' })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntitiesStable(true)

      // Send real-time update via WebSocket
      if (enableRealTimeUpdates && webSocket.isConnected) {
        webSocket.sendMessage({
          type: MessageType.ENTITY_UPDATED,
          payload: {
            entityType: config.name,
            entityId: id,
            entityData: result,
            changes: data
          }
        } as any)
      }

      // Remove operation after success
      setTimeout(() => removeOptimisticOperation(operationId), 2000)

      return { success: true as const, data: result as TEntity }
    } catch (err) {
      const apiError = createApiError(err)

      // Check if this is a conflict (409 status or conflict-related error)
      const isConflict = apiError.statusCode === 409 ||
                        apiError.message.toLowerCase().includes('conflict') ||
                        apiError.message.toLowerCase().includes('version') ||
                        apiError.message.toLowerCase().includes('concurrent')

      if (isConflict) {
        // Try to get server data for conflict resolution
        let serverData = currentData
        try {
          // Attempt to fetch current server data
          const response = await api.get(formatUrl(config.endpoints.update, id))
          serverData = response.data as Record<string, unknown>
        } catch (fetchError) {
          // If we can't fetch server data, use cached data
          console.warn('Could not fetch server data for conflict resolution')
        }

        // Detect conflict
        detectConflict(operationId, data as Record<string, unknown>, serverData)
        return { success: false as const, validationErrors: { fieldErrors: {}, nonFieldErrors: ['Conflict detected - please resolve manually'] } }
      }

      // Regular error handling
      updateOptimisticOperation(operationId, { status: 'failed', error: apiError.message })

      // Rollback optimistic changes
      rollbackOptimisticOperation(operationId)

      return { success: false as const, validationErrors: { fieldErrors: {}, nonFieldErrors: [apiError.message] } }
    }
  }, [config.name, state.paginationCache, getCacheKey, addOptimisticOperation, updateOptimisticOperation, removeOptimisticOperation, rollbackOptimisticOperation, retryWithBackoff, apiServices.mutations.updateItem, invalidateCache, fetchEntitiesStable, enableRealTimeUpdates, webSocket])

  // Perform optimistic delete operation
  const performOptimisticDelete = useCallback(async (id: string | number): Promise<EntityOperationResult<TEntity>> => {
    const operationId = generateOperationId(config.name, 'delete', id)

    // Get current entity data for rollback purposes (from cache if available)
    let currentData: Record<string, unknown> = {}
    const cacheKey = getCacheKey()
    const cachedPage = state.paginationCache[cacheKey]
    if (cachedPage?.data?.results) {
      const entity = cachedPage.data.results.find((item: any) => item.id === id)
      if (entity) {
        currentData = entity as Record<string, unknown>
      }
    }

    // Create optimistic operation
    const optimisticOperation: OptimisticOperation = {
      id: operationId,
      type: 'delete',
      entityType: config.name,
      entityId: id,
      localData: {} as Record<string, unknown>, // Empty for delete operations
      serverData: currentData as Record<string, unknown>,
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0
    }

    // Add to optimistic state
    addOptimisticOperation(optimisticOperation)

    // Immediately update UI with optimistic data
    // Note: In a full implementation, this would remove the entity from local state
    // For now, we'll rely on cache invalidation after server confirmation

    try {
      // Perform server operation
      await retryWithBackoff(async () => {
        await apiServices.mutations.deleteItem.mutateAsync(id)
      })

      // Update operation as successful
      updateOptimisticOperation(operationId, { status: 'confirmed' })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntitiesStable(true)

      // Send real-time update via WebSocket
      if (enableRealTimeUpdates && webSocket.isConnected) {
        webSocket.sendMessage({
          type: MessageType.ENTITY_DELETED,
          payload: {
            entityType: config.name,
            entityId: id
          }
        } as any)
      }

      // Remove operation after success
      setTimeout(() => removeOptimisticOperation(operationId), 2000)

      return { success: true as const, data: currentData as TEntity }
    } catch (err) {
      const apiError = createApiError(err)

      // Update operation as failed
      updateOptimisticOperation(operationId, { status: 'failed', error: apiError.message })

      // Rollback optimistic changes
      rollbackOptimisticOperation(operationId)

      return { success: false as const, validationErrors: { fieldErrors: {}, nonFieldErrors: [apiError.message] } }
    }
  }, [config.name, state.paginationCache, getCacheKey, addOptimisticOperation, updateOptimisticOperation, removeOptimisticOperation, rollbackOptimisticOperation, retryWithBackoff, apiServices.mutations.deleteItem, invalidateCache, fetchEntitiesStable, enableRealTimeUpdates, webSocket])

  // Handle real-time updates from WebSocket
  const handleRealTimeUpdate = useCallback((message: any) => {
    if (!enableRealTimeUpdates) return

    // Handle presence messages
    if ('userId' in message && 'userName' in message) {
      handlePresenceMessage(message)
      return
    }

    // Handle entity updates
    if ('entityType' in message && message.entityType === config.name) {
      switch (message.type) {
        case MessageType.ENTITY_CREATED:
        case MessageType.ENTITY_UPDATED:
        case MessageType.ENTITY_DELETED:
        case MessageType.ENTITY_BULK_UPDATED:
          // Trigger a refetch to get the latest data
          fetchEntities(true)
          break
      }
    }
  }, [enableRealTimeUpdates, config.name, fetchEntities, handlePresenceMessage])

  // Update message handler ref when handleRealTimeUpdate changes
  useEffect(() => {
    messageHandlerRef.current = handleRealTimeUpdate
  }, [handleRealTimeUpdate])

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
  const createEntity = useCallback(async (data: TFormData): Promise<EntityOperationResult<TEntity>> => {
    // Use optimistic updates if enabled
    if (enableOptimisticUpdates) {
      return performOptimisticCreate(data)
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      // Check if we're offline
      if (!offlineState.isOnline) {
        // Queue operation for offline execution
        const operation: OfflineOperation = {
          id: `create_${config.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'create',
          entityType: config.name,
          entityId: undefined, // Will be assigned when synced
          data: data as Record<string, unknown>,
          timestamp: Date.now(),
          priority: 'normal',
          retryCount: 0,
          maxRetries: 3
        }

        await offlineStorage.storeOperation(operation)

        // Return success for offline operation (will be synced later)
        return { success: true as const, data: data as unknown as TEntity }
      }

      const result = await retryWithBackoff(async () => {
        const response = await apiServices.mutations.addItem.mutateAsync(data as unknown as TEntity)
        return response
      })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      // Send real-time update via WebSocket
      if (enableRealTimeUpdates && webSocket.isConnected) {
        webSocket.sendMessage({
          type: MessageType.ENTITY_CREATED,
          payload: {
            entityType: config.name,
            entityId: (result as any)?.id,
            entityData: result
          }
        } as any)
      }

      return { success: true as const, data: result as TEntity }
    } catch (err) {
      const apiError = createApiError(err)
      
      // If we're offline or network error, queue the operation
      if (!offlineState.isOnline || (apiError.statusCode && apiError.statusCode >= 500)) {
        try {
          const operation: OfflineOperation = {
            id: `create_${config.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'create',
            entityType: config.name,
            entityId: undefined,
            data: data as Record<string, unknown>,
            timestamp: Date.now(),
            priority: 'normal',
            retryCount: 0,
            maxRetries: 3
        }

        await offlineStorage.storeOperation(operation)
        return { success: true as const, data: data as unknown as TEntity }
      } catch {
        // If offline storage also fails, return the original error
        setError(apiError)
        actions.setError(apiError.message)
        return {
          success: false as const,
          validationErrors: {
            fieldErrors: {},
            nonFieldErrors: [apiError.message]
          }
        }
      }
    }
    
    // Check if it's a validation error (400 status with field errors)
    if (apiError.statusCode === 400 && apiError.details) {
      return {
        success: false as const,
        validationErrors: {
          fieldErrors: apiError.details as Record<string, string[]>,
          nonFieldErrors: []
        }
      }
    }
    
    setError(apiError)
    actions.setError(apiError.message)
    return {
      success: false as const,
      validationErrors: {
        fieldErrors: {},
        nonFieldErrors: [apiError.message]
      }
    }
  } finally {
    setIsLoading(false)
  }
}, [enableOptimisticUpdates, performOptimisticCreate, setIsLoading, setError, actions, offlineState.isOnline, offlineStorage, retryWithBackoff, apiServices.mutations.addItem, invalidateCache, fetchEntities, enableRealTimeUpdates, webSocket, config.name])  // Update entity with optimistic updates
  const updateEntity = useCallback(async (id: string | number, data: Partial<TFormData>): Promise<EntityOperationResult<TEntity>> => {
    // Use optimistic updates if enabled
    if (enableOptimisticUpdates) {
      return performOptimisticUpdate(id, data)
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      // Check if we're offline
      if (!offlineState.isOnline) {
        // Queue operation for offline execution
        const operation: OfflineOperation = {
          id: `update_${config.name}_${id}_${Date.now()}`,
          type: 'update',
          entityType: config.name,
          entityId: id,
          data: data as Record<string, unknown>,
          timestamp: Date.now(),
          priority: 'normal',
          retryCount: 0,
          maxRetries: 3
        }

        await offlineStorage.storeOperation(operation)

        // Return success for offline operation (will be synced later)
        return { success: true as const, data: { id, ...data } as unknown as TEntity }
      }

      const result = await retryWithBackoff(async () => {
        const response = await apiServices.mutations.updateItem.mutateAsync({
          id,
          data: data as unknown as TEntity
        })
        return response
      })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      // Send real-time update via WebSocket
      if (enableRealTimeUpdates && webSocket.isConnected) {
        webSocket.sendMessage({
          type: MessageType.ENTITY_UPDATED,
          payload: {
            entityType: config.name,
            entityId: id,
            entityData: result
          }
        } as any)
      }

      return { success: true as const, data: result as TEntity }
    } catch (err) {
      const apiError = createApiError(err)
      
      // If we're offline or network error, queue the operation
      if (!offlineState.isOnline || (apiError.statusCode && apiError.statusCode >= 500)) {
        try {
          const operation: OfflineOperation = {
            id: `update_${config.name}_${id}_${Date.now()}`,
            type: 'update',
            entityType: config.name,
            entityId: id,
            data: data as Record<string, unknown>,
            timestamp: Date.now(),
            priority: 'normal',
            retryCount: 0,
            maxRetries: 3
          }

          await offlineStorage.storeOperation(operation)
          return { success: true as const, data: { id, ...data } as unknown as TEntity }
        } catch {
          // If offline storage also fails, return the original error
          setError(apiError)
          actions.setError(apiError.message)
          return {
            success: false as const,
            validationErrors: {
              fieldErrors: {},
              nonFieldErrors: [apiError.message]
            }
          }
        }
      }
      
      // Check if it's a validation error (400 status with field errors)
      if (apiError.statusCode === 400 && apiError.details) {
        return {
          success: false as const,
          validationErrors: {
            fieldErrors: apiError.details as Record<string, string[]>,
            nonFieldErrors: []
          }
        }
      }
      
      setError(apiError)
      actions.setError(apiError.message)
      return {
        success: false as const,
        validationErrors: {
          fieldErrors: {},
          nonFieldErrors: [apiError.message]
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [enableOptimisticUpdates, performOptimisticUpdate, setIsLoading, setError, actions, offlineState.isOnline, offlineStorage, retryWithBackoff, apiServices.mutations.updateItem, invalidateCache, fetchEntities, enableRealTimeUpdates, webSocket, config.name])

  // Delete entity with cascade operations
  const deleteEntity = useCallback(async (id: string | number): Promise<boolean> => {
    // Use optimistic updates if enabled
    if (enableOptimisticUpdates) {
      const result = await performOptimisticDelete(id)
      return result.success
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null) // Clear any previous errors

      // Check if we're offline
      if (!offlineState.isOnline) {
        // For offline deletes, we skip cascade operations analysis since they require network
        // Queue operation for offline execution
        const operation: OfflineOperation = {
          id: `delete_${config.name}_${id}_${Date.now()}`,
          type: 'delete',
          entityType: config.name,
          entityId: id,
          data: {}, // No additional data needed for delete
          timestamp: Date.now(),
          priority: 'high', // Deletions should be prioritized
          retryCount: 0,
          maxRetries: 3
        }

        await offlineStorage.storeOperation(operation)

        // Return success for offline operation (will be synced later)
        return true
      }

      // Analyze cascade operations before deleting
      const cascadeOperations = await analyzeCascadeOperations({
        entityType: config.name,
        entityId: id.toString(),
        operation: 'delete'
      })

      // Execute cascade operations if any exist
      if (cascadeOperations.length > 0) {
        const cascadeResult = await executeCascadeOperations(cascadeOperations)
        if (!cascadeResult.success) {
          // Cascade operations failed, don't proceed with main deletion
          const cascadeError = new Error(`Cascade operations failed: ${cascadeResult.errors.map(e => e.message).join(', ')}`)
          setError(createApiError(cascadeError))
          actions.setError(cascadeError.message)
          return false
        }
      }

      // Perform the main entity deletion
      await retryWithBackoff(async () => {
        await apiServices.mutations.deleteItem.mutateAsync(id)
      })

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      // Send real-time update via WebSocket
      if (enableRealTimeUpdates && webSocket.isConnected) {
        webSocket.sendMessage({
          type: MessageType.ENTITY_DELETED,
          payload: {
            entityType: config.name,
            entityId: id
          }
        } as any)
      }

      return true
    } catch (err) {
      const apiError = createApiError(err)
      
      // If we're offline or network error, queue the operation
      if (!offlineState.isOnline || (apiError.statusCode && apiError.statusCode >= 500)) {
        try {
          const operation: OfflineOperation = {
            id: `delete_${config.name}_${id}_${Date.now()}`,
            type: 'delete',
            entityType: config.name,
            entityId: id,
            data: {},
            timestamp: Date.now(),
            priority: 'high',
            retryCount: 0,
            maxRetries: 3
          }

          await offlineStorage.storeOperation(operation)
          return true
        } catch {
          // If offline storage also fails, return the original error
          setError(apiError)
          actions.setError(apiError.message)
          return false
        }
      }
      
      setError(apiError)
      actions.setError(apiError.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [enableOptimisticUpdates, performOptimisticDelete, setIsLoading, setError, actions, offlineState.isOnline, offlineStorage, retryWithBackoff, apiServices.mutations.deleteItem, invalidateCache, fetchEntities, enableRealTimeUpdates, webSocket, config.name])

  // Batch delete with progress tracking
  const batchDeleteEntities = useCallback(async (
    ids: (string | number)[],
    onProgress?: (progress: BulkOperationProgress) => void
  ): Promise<BulkOperationResult> => {
    const startTime = Date.now()
    const progress: BulkOperationProgress = {
      total: ids.length,
      completed: 0,
      failed: 0,
      errors: []
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null)

      // Process deletions in batches to avoid overwhelming the server
      const batchSize = 5
      const results: Array<{ id: string | number; success: boolean; error?: string }> = []

      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize)
        const batchPromises = batch.map(async (id) => {
          try {
            progress.currentItem = id
            onProgress?.(progress)

            // Analyze cascade operations for this entity
            const cascadeOperations = await analyzeCascadeOperations({
              entityType: config.name,
              entityId: id.toString(),
              operation: 'delete'
            })

            // Execute cascade operations if any exist
            if (cascadeOperations.length > 0) {
              const cascadeResult = await executeCascadeOperations(cascadeOperations)
              if (!cascadeResult.success) {
                // Cascade operations failed for this entity
                const cascadeError = `Cascade operations failed: ${cascadeResult.errors.map(e => e.message).join(', ')}`
                progress.failed++
                progress.errors.push({ id, error: cascadeError })
                return { id, success: false, error: cascadeError }
              }
            }

            // Perform the main entity deletion
            await retryWithBackoff(() => apiServices.mutations.deleteItem.mutateAsync(id))
            progress.completed++
            return { id, success: true }
          } catch (err) {
            const apiError = createApiError(err)
            progress.failed++
            progress.errors.push({ id, error: apiError.message })
            return { id, success: false, error: apiError.message }
          } finally {
            onProgress?.(progress)
          }
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      }

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return {
        success: failed === 0,
        totalProcessed: ids.length,
        successful,
        failed,
        errors: progress.errors,
        duration: Date.now() - startTime
      }
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)

      return {
        success: false,
        totalProcessed: ids.length,
        successful: progress.completed,
        failed: progress.failed + (ids.length - progress.completed - progress.failed),
        errors: progress.errors,
        duration: Date.now() - startTime
      }
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.deleteItem, retryWithBackoff, invalidateCache, fetchEntities, actions, config.name])

  // Batch update with progress tracking
  const batchUpdateEntities = useCallback(async (
    updates: Array<{ id: string | number; data: Partial<TFormData> }>,
    onProgress?: (progress: BulkOperationProgress) => void
  ): Promise<BulkOperationResult> => {
    const startTime = Date.now()
    const progress: BulkOperationProgress = {
      total: updates.length,
      completed: 0,
      failed: 0,
      errors: []
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null)

      // Process updates in batches to avoid overwhelming the server
      const batchSize = 3
      const results: Array<{ id: string | number; success: boolean; error?: string }> = []

      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize)
        const batchPromises = batch.map(async (update) => {
          try {
            progress.currentItem = update.id
            onProgress?.(progress)

            await retryWithBackoff(() =>
              apiServices.mutations.updateItem.mutateAsync({
                id: update.id,
                data: update.data as unknown as TEntity
              })
            )
            progress.completed++
            return { id: update.id, success: true }
          } catch (err) {
            const apiError = createApiError(err)
            progress.failed++
            progress.errors.push({ id: update.id, error: apiError.message })
            return { id: update.id, success: false, error: apiError.message }
          } finally {
            onProgress?.(progress)
          }
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      }

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return {
        success: failed === 0,
        totalProcessed: updates.length,
        successful,
        failed,
        errors: progress.errors,
        duration: Date.now() - startTime
      }
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)

      return {
        success: false,
        totalProcessed: updates.length,
        successful: progress.completed,
        failed: progress.failed + (updates.length - progress.completed - progress.failed),
        errors: progress.errors,
        duration: Date.now() - startTime
      }
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.updateItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

  // Batch create with progress tracking
  const batchCreateEntities = useCallback(async (
    items: TFormData[],
    onProgress?: (progress: BulkOperationProgress) => void
  ): Promise<BulkOperationResult> => {
    const startTime = Date.now()
    const progress: BulkOperationProgress = {
      total: items.length,
      completed: 0,
      failed: 0,
      errors: []
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null)

      // Process creations in batches to avoid overwhelming the server
      const batchSize = 3
      const results: Array<{ id?: string | number; success: boolean; error?: string; data?: TEntity }> = []

      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize)
        const batchPromises = batch.map(async (item, index) => {
          const itemIndex = i + index
          try {
            progress.currentItem = itemIndex
            onProgress?.(progress)

            const result = await retryWithBackoff(() =>
              apiServices.mutations.addItem.mutateAsync(item as unknown as TEntity)
            )
            progress.completed++
            return { id: (result as TEntity).id, success: true, data: result as TEntity }
          } catch (err) {
            const apiError = createApiError(err)
            progress.failed++
            progress.errors.push({ id: itemIndex, error: apiError.message })
            return { id: itemIndex, success: false, error: apiError.message }
          } finally {
            onProgress?.(progress)
          }
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      }

      // Invalidate cache and refresh
      invalidateCache()
      fetchEntities(true)

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return {
        success: failed === 0,
        totalProcessed: items.length,
        successful,
        failed,
        errors: progress.errors,
        duration: Date.now() - startTime
      }
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)

      return {
        success: false,
        totalProcessed: items.length,
        successful: progress.completed,
        failed: progress.failed + (items.length - progress.completed - progress.failed),
        errors: progress.errors,
        duration: Date.now() - startTime
      }
    } finally {
      setIsLoading(false)
    }
  }, [apiServices.mutations.addItem, retryWithBackoff, invalidateCache, fetchEntities, actions])

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

  // Sync pending offline operations
  const syncPendingOperations = useCallback(async (): Promise<SyncResult> => {
    if (!offlineState.isOnline) {
      return {
        success: false,
        operationsProcessed: 0,
        operationsSuccessful: 0,
        operationsFailed: 0,
        errors: [{ operationId: 'sync', error: 'Currently offline' }],
        duration: 0
      }
    }

    try {
      setIsLoading(true)
      setError(null)
      actions.setError(null)

      const operations = await offlineStorage.getPendingOperations()
      const entityOperations = operations.filter(op => op.entityType === config.name)

      let successful = 0
      let failed = 0
      const errors: Array<{ operationId: string; error: string }> = []
      const startTime = Date.now()

      for (const operation of entityOperations) {
        try {
          let result: EntityOperationResult<TEntity>

          switch (operation.type) {
            case 'create':
              result = await createEntity(operation.data as TFormData)
              break
            case 'update':
              if (!operation.entityId) throw new Error('Entity ID required for update operation')
              result = await updateEntity(operation.entityId, operation.data as Partial<TFormData>)
              break
            case 'delete':
              if (!operation.entityId) throw new Error('Entity ID required for delete operation')
              const deleteSuccess = await deleteEntity(operation.entityId)
              result = deleteSuccess
                ? { success: true as const, data: {} as TEntity }
                : { success: false as const, validationErrors: { fieldErrors: {}, nonFieldErrors: ['Delete failed'] } }
              break
            default:
              throw new Error(`Unknown operation type: ${operation.type}`)
          }

          if (result.success) {
            await offlineStorage.removeOperation(operation.id)
            successful++
          } else {
            // Increment retry count
            operation.retryCount++
            if (operation.retryCount < operation.maxRetries) {
              await offlineStorage.updateOperation(operation)
            } else {
              await offlineStorage.removeOperation(operation.id)
              errors.push({
                operationId: operation.id,
                error: `Max retries exceeded: ${result.validationErrors?.nonFieldErrors?.join(', ') || 'Unknown error'}`
              })
            }
            failed++
          }
        } catch (error) {
          // Increment retry count
          operation.retryCount++
          if (operation.retryCount < operation.maxRetries) {
            await offlineStorage.updateOperation(operation)
          } else {
            await offlineStorage.removeOperation(operation.id)
            errors.push({
              operationId: operation.id,
              error: error instanceof Error ? error.message : 'Unknown sync error'
            })
          }
          failed++
        }
      }

      // Invalidate cache and refresh after sync
      invalidateCache()
      fetchEntities(true)

      return {
        success: failed === 0,
        operationsProcessed: entityOperations.length,
        operationsSuccessful: successful,
        operationsFailed: failed,
        errors,
        duration: Date.now() - startTime
      }
    } catch (err) {
      const apiError = createApiError(err)
      setError(apiError)
      actions.setError(apiError.message)

      return {
        success: false,
        operationsProcessed: 0,
        operationsSuccessful: 0,
        operationsFailed: 0,
        errors: [{ operationId: 'sync', error: apiError.message }],
        duration: 0
      }
    } finally {
      setIsLoading(false)
    }
  }, [offlineState.isOnline, offlineStorage, config.name, createEntity, updateEntity, deleteEntity, invalidateCache, fetchEntities, actions])

  // ===== UTILITY FUNCTIONS =====

  // API actions object
  const apiActions: EntityApiActions<TEntity, TFormData> = useMemo(() => ({
    // expose stable wrapper to callers
    fetchEntities: fetchEntitiesStable,
    fetchEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    batchDeleteEntities,
    batchUpdateEntities,
    batchCreateEntities,
    exportEntities,
    invalidateCache,
    cancelPendingRequests,
    retryFailedOperation,
    syncPendingOperations,
    analyzeCascadeOperations: (entityType: string, entityId: string, operation: 'delete' | 'update' | 'archive') =>
      analyzeCascadeOperations({ entityType, entityId, operation }),
    executeCascadeOperations
  }), [
    fetchEntitiesStable,
    fetchEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    batchDeleteEntities,
    batchUpdateEntities,
    batchCreateEntities,
    exportEntities,
    invalidateCache,
    cancelPendingRequests,
    retryFailedOperation,
    syncPendingOperations,
    analyzeCascadeOperations,
    executeCascadeOperations
  ])

  // Retry failed optimistic operation
  const retryOptimisticOperation = useCallback(async (operationId: string): Promise<void> => {
    const operation = optimisticState.operations.get(operationId)
    if (!operation || operation.status !== 'failed') return

    // Update operation status to pending
    updateOptimisticOperation(operationId, { status: 'pending', retryCount: operation.retryCount + 1 })

    try {
      let result: EntityOperationResult<TEntity>

      switch (operation.type) {
        case 'create':
          result = await performOptimisticCreate(operation.localData as TFormData)
          break
        case 'update':
          if (!operation.entityId) throw new Error('Entity ID required for update operation')
          result = await performOptimisticUpdate(operation.entityId, operation.localData as Partial<TFormData>)
          break
        case 'delete':
          if (!operation.entityId) throw new Error('Entity ID required for delete operation')
          result = await performOptimisticDelete(operation.entityId)
          break
        default:
          throw new Error(`Unknown operation type: ${operation.type}`)
      }

      if (!result.success) {
        // If retry failed, keep it as failed
        updateOptimisticOperation(operationId, { status: 'failed', error: result.validationErrors?.nonFieldErrors?.join(', ') || 'Retry failed' })
      }
    } catch (error) {
      // Update operation as failed again
      updateOptimisticOperation(operationId, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Retry failed' 
      })
    }
  }, [optimisticState.operations, updateOptimisticOperation, performOptimisticCreate, performOptimisticUpdate, performOptimisticDelete])

  return {
    isLoading,
    error,
    offlineState,
    realTimeState: {
      isConnected: webSocket.isConnected,
      connectionState: webSocket.connectionState,
      queuedMessagesCount: webSocket.queuedMessagesCount
    },
    presenceState,
    presenceActions: {
      updatePresenceViewing,
      updatePresenceEditing
    },
    optimisticState,
    optimisticActions: {
      rollbackOperation: rollbackOptimisticOperation,
      retryOperation: retryOptimisticOperation,
      clearFailedOperations: () => {
        setOptimisticState(prev => ({
          ...prev,
          operations: new Map(
            Array.from(prev.operations.entries()).filter(([_, op]) => op.status !== 'failed')
          ),
          failedCount: 0
        }))
      },
      resolveConflict,
      dismissConflict
    },
    conflictUI: {
      ConflictResolutionDialog,
      ConflictNotification
    },
    ...apiActions
  }
}

// ===== BULK OPERATION TYPES =====

export interface BulkOperationProgress {
  total: number
  completed: number
  failed: number
  currentItem?: string | number
  errors: Array<{ id: string | number; error: string }>
}

export interface BulkOperationResult {
  success: boolean
  totalProcessed: number
  successful: number
  failed: number
  errors: Array<{ id: string | number; error: string }>
  duration: number
}